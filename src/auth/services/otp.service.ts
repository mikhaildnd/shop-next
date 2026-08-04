import type { OtpPurpose } from '@/generated/prisma/client';
import { prisma } from '@/lib/db';

interface SetOtpCooldownParams {
    identifier: string;
    purpose: OtpPurpose;
    duration: number;
}

interface GetOtpCooldownParams {
    identifier: string;
    purpose: OtpPurpose;
}

interface GetOtpRetryAfterParams {
    identifier: string;
    purpose: OtpPurpose;
}

async function getOtpCooldown({ identifier, purpose }: GetOtpCooldownParams) {
    return prisma.otpCooldown.findUnique({
        where: {
            identifier_purpose: {
                identifier,
                purpose,
            },
        },
    });
}

interface DeleteOtpCooldownParams {
    identifier: string;
    purpose: OtpPurpose;
}

export async function setOtpCooldown({
    identifier,
    purpose,
    duration,
}: SetOtpCooldownParams) {
    const expiresAt = new Date(Date.now() + duration * 1000);

    return prisma.otpCooldown.upsert({
        where: {
            identifier_purpose: {
                identifier,
                purpose,
            },
        },
        create: {
            identifier,
            purpose,
            expiresAt,
        },
        update: {
            expiresAt,
        },
    });
}

export async function getOtpRetryAfter({
    identifier,
    purpose,
}: GetOtpRetryAfterParams): Promise<number> {
    const cooldown = await getOtpCooldown({
        identifier,
        purpose,
    });

    if (!cooldown) {
        return 0;
    }

    const retryAfter = Math.ceil(
        (cooldown.expiresAt.getTime() - Date.now()) / 1000,
    );

    if (retryAfter <= 0) {
        await deleteOtpCooldown({
            identifier,
            purpose,
        });

        return 0;
    }

    return retryAfter;
}

export async function deleteOtpCooldown({
    identifier,
    purpose,
}: DeleteOtpCooldownParams) {
    return prisma.otpCooldown.deleteMany({
        where: {
            identifier,
            purpose,
        },
    });
}

export async function deleteOtpCooldownsByIdentifier(identifier: string) {
    return prisma.otpCooldown.deleteMany({
        where: {
            identifier,
        },
    });
}
