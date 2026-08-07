import { prisma } from '@/lib/db';
import { RATE_LIMIT_RETENTION_SECONDS } from '@/services/rate-limit/rate-limit.consts';

import type {
    CheckRateLimitParams,
    CheckRateLimitResult,
    RateLimitAction,
    RateLimitState,
} from './rate-limit.types';

// TODO:
// Schedule cleanupRateLimits() to run periodically.

export async function consumeRateLimit({
    action,
    identifier,
    windowSeconds,
    max,
}: CheckRateLimitParams): Promise<CheckRateLimitResult> {
    const now = new Date();

    const record = await prisma.rateLimit.findUnique({
        where: {
            action_identifier: {
                action,
                identifier,
            },
        },
    });

    if (!record) {
        await createRateLimit({
            action,
            identifier,
        });

        return createAllowedResult(1, max);
    }

    if (record.expiresAt) {
        if (record.expiresAt > now) {
            const retryAfterSeconds = Math.ceil(
                (record.expiresAt.getTime() - now.getTime()) / 1000,
            );

            return {
                allowed: false,
                attempts: record.count,
                remainingAttempts: 0,
                retryAfterSeconds,
            };
        }

        await prisma.rateLimit.delete({
            where: {
                action_identifier: {
                    action,
                    identifier,
                },
            },
        });

        await createRateLimit({
            action,
            identifier,
        });

        return createAllowedResult(1, max);
    }

    if (record.count < max) {
        const attempts = record.count + 1;

        await prisma.rateLimit.update({
            where: {
                action_identifier: {
                    action,
                    identifier,
                },
            },
            data: {
                count: attempts,
            },
        });

        return createAllowedResult(attempts, max);
    }

    const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

    const retryAfterSeconds = Math.ceil(
        (expiresAt.getTime() - now.getTime()) / 1000,
    );

    await prisma.rateLimit.update({
        where: {
            action_identifier: {
                action,
                identifier,
            },
        },
        data: {
            expiresAt,
        },
    });

    return {
        allowed: false,
        attempts: record.count,
        remainingAttempts: 0,
        retryAfterSeconds,
    };
}

async function createRateLimit({
    action,
    identifier,
}: {
    action: RateLimitAction;
    identifier: string;
}) {
    return prisma.rateLimit.create({
        data: {
            action,
            identifier,
            count: 1,
            expiresAt: null,
        },
    });
}

function createAllowedResult(
    attempts: number,
    max: number,
): CheckRateLimitResult {
    return {
        allowed: true,
        attempts,
        remainingAttempts: max - attempts,
        retryAfterSeconds: 0,
    };
}

export async function cleanupRateLimits() {
    const retentionDate = new Date(
        Date.now() - RATE_LIMIT_RETENTION_SECONDS * 1000,
    );

    return prisma.rateLimit.deleteMany({
        where: {
            expiresAt: {
                not: null,
                lt: retentionDate,
            },
        },
    });
}

interface GetRateLimitStateParams {
    action: RateLimitAction;
    identifier: string;
    max: number;
}

export async function getRateLimitState({
    action,
    identifier,
    max,
}: GetRateLimitStateParams): Promise<RateLimitState | null> {
    const now = new Date();

    const record = await prisma.rateLimit.findUnique({
        where: {
            action_identifier: {
                action,
                identifier,
            },
        },
    });

    if (!record) {
        return null;
    }

    if (record.expiresAt && record.expiresAt <= now) {
        await prisma.rateLimit.delete({
            where: {
                action_identifier: {
                    action,
                    identifier,
                },
            },
        });

        return null;
    }

    const remainingAttempts = Math.max(max - record.count, 0);

    const retryAfterSeconds = record.expiresAt
        ? Math.max(
              Math.ceil((record.expiresAt.getTime() - now.getTime()) / 1000),
              0,
          )
        : 0;

    return {
        attempts: record.count,
        remainingAttempts,
        retryAfterSeconds,
    };
}

interface DeleteRateLimitParams {
    action: RateLimitAction;
    identifier: string;
}

export async function deleteRateLimit({
    action,
    identifier,
}: DeleteRateLimitParams) {
    return prisma.rateLimit.deleteMany({
        where: {
            action,
            identifier,
        },
    });
}
