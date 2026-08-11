import { prisma } from '@/lib/db';
import { RATE_LIMIT_RETENTION_SECONDS } from '@/services/rate-limit/rate-limit.consts';

import type {
    ActiveRateLimit,
    ConsumeRateLimitParams,
    ConsumeRateLimitResult,
    RateLimitAction,
} from './rate-limit.types';

// TODO:
// Schedule cleanupRateLimits() to run periodically.

export async function consumeRateLimit({
    action,
    identifier,
    max,
    attemptLifetimeSeconds,
}: ConsumeRateLimitParams): Promise<ConsumeRateLimitResult> {
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

        return createConsumeRateLimitResult(1, max);
    }

    const attemptLifetimeDate = new Date(
        now.getTime() - attemptLifetimeSeconds * 1000,
    );

    if (!record.expiresAt && record.updatedAt < attemptLifetimeDate) {
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

        return createConsumeRateLimitResult(1, max);
    }

    if (record.expiresAt && record.expiresAt > now) {
        return {
            attempts: record.count,
            remainingAttempts: 0,
        };
    }

    if (record.expiresAt) {
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

        return createConsumeRateLimitResult(1, max);
    }

    const attempts = Math.min(record.count + 1, max);

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

    return createConsumeRateLimitResult(attempts, max);
}

interface ActivateRateLimitParams {
    action: RateLimitAction;
    identifier: string;
    windowSeconds: number;
}

export async function activateRateLimit({
    action,
    identifier,
    windowSeconds,
}: ActivateRateLimitParams): Promise<ActiveRateLimit | null> {
    const now = Date.now();

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

    if (record.expiresAt && record.expiresAt.getTime() > now) {
        return {
            expiresAt: record.expiresAt.getTime(),
        };
    }

    const expiresAt = now + windowSeconds * 1000;

    await prisma.rateLimit.update({
        where: {
            action_identifier: {
                action,
                identifier,
            },
        },
        data: {
            expiresAt: new Date(expiresAt),
        },
    });

    return {
        expiresAt,
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

function createConsumeRateLimitResult(
    attempts: number,
    max: number,
): ConsumeRateLimitResult {
    return {
        attempts,
        remainingAttempts: Math.max(max - attempts, 0),
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
}

export async function getRateLimitState({
    action,
    identifier,
}: GetRateLimitStateParams): Promise<ActiveRateLimit | null> {
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

    if (!record.expiresAt) {
        return null;
    }

    return {
        expiresAt: record.expiresAt.getTime(),
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
