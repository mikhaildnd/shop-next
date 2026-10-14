import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { createAuthMiddleware } from 'better-auth/api';
import { nextCookies } from 'better-auth/next-js';
import { anonymous, emailOTP } from 'better-auth/plugins';

import {
    OTP_ALLOWED_ATTEMPTS,
    OTP_EXPIRES_IN,
    OTP_LENGTH,
    PENDING_ACCOUNT_MERGE_COOKIE,
    PENDING_ACCOUNT_MERGE_MAX_AGE,
    SESSION_EXPIRES_IN_AGE,
    SESSION_UPDATE_AGE,
} from '@/auth/auth.constants';
import { accountMergePlugin } from '@/auth/plugins/account-merge';
import { prisma } from '@/db';
import { sendEmailOtp } from '@/email/email.service';
import {
    cleanupMergedAnonymousUsers,
    mergeAnonymousAccountData,
} from '@/services/account/account-merge.service';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    session: {
        expiresIn: SESSION_EXPIRES_IN_AGE,
        updateAge: SESSION_UPDATE_AGE,
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
    },
    user: {
        deleteUser: {
            enabled: true,
        },
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            const newSession = ctx.context.newSession;

            if (!newSession || newSession.user.isAnonymous) return;

            await ctx.context.runInBackgroundOrAwait(
                cleanupMergedAnonymousUsers(
                    newSession.user.id,
                    (anonymousUserId) =>
                        ctx.context.internalAdapter.deleteUser(anonymousUserId),
                ),
            );
        }),
    },
    plugins: [
        anonymous({
            disableDeleteAnonymousUser: true,
            onLinkAccount: async ({ anonymousUser, newUser, ctx }) => {
                const anonymousUserId = anonymousUser.user.id;
                const userId = newUser.user.id;

                async function savePendingAccountMerge() {
                    await ctx.setSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        JSON.stringify({
                            anonymousUserId,
                            userId,
                        }),
                        ctx.context.secret,
                        {
                            maxAge: PENDING_ACCOUNT_MERGE_MAX_AGE,
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                        },
                    );
                }

                try {
                    const result = await prisma.user.updateMany({
                        where: {
                            id: anonymousUserId,
                            isAnonymous: true,
                            mergeTargetUserId: null,
                            mergeStartedAt: null,
                        },
                        data: {
                            mergeTargetUserId: userId,
                            mergeStartedAt: new Date(),
                        },
                    });

                    if (result.count === 0) {
                        const existingUser = await prisma.user.findUnique({
                            where: { id: anonymousUserId },
                            select: {
                                isAnonymous: true,
                                mergeTargetUserId: true,
                                mergeStartedAt: true,
                                mergeCompletedAt: true,
                                mergeDismissedAt: true,
                            },
                        });

                        if (
                            existingUser?.isAnonymous !== true ||
                            existingUser.mergeTargetUserId !== userId ||
                            existingUser.mergeStartedAt === null ||
                            existingUser.mergeCompletedAt !== null ||
                            existingUser.mergeDismissedAt !== null
                        ) {
                            ctx.context.logger.error(
                                'Anonymous account merge is not available',
                                { anonymousUserId, userId },
                            );

                            await savePendingAccountMerge();
                            return;
                        }
                    }
                } catch (error) {
                    ctx.context.logger.error(
                        'Failed to prepare account merge',
                        { anonymousUserId, userId, error },
                    );

                    await savePendingAccountMerge();
                    return;
                }

                try {
                    const result = await mergeAnonymousAccountData(
                        anonymousUserId,
                        userId,
                    );

                    if (result === 'unavailable') {
                        await savePendingAccountMerge();
                        return;
                    }
                } catch (error) {
                    ctx.context.logger.error('Failed to merge account data', {
                        anonymousUserId,
                        userId,
                        error,
                    });

                    await savePendingAccountMerge();
                    return;
                }

                try {
                    await ctx.context.internalAdapter.deleteUser(
                        anonymousUserId,
                    );
                } catch (error) {
                    ctx.context.logger.error(
                        'Failed to delete anonymous user after account merge',
                        { anonymousUserId, userId, error },
                    );
                }
            },
        }),
        accountMergePlugin(),
        emailOTP({
            overrideDefaultEmailVerification: true,
            changeEmail: {
                enabled: true,
            },
            sendVerificationOTP: sendEmailOtp,
            sendVerificationOnSignUp: true,
            otpLength: OTP_LENGTH,
            allowedAttempts: OTP_ALLOWED_ATTEMPTS,
            expiresIn: OTP_EXPIRES_IN,
            resendStrategy: 'rotate',
        }),
        nextCookies(), // must be last
    ],
});
