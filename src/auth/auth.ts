import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { anonymous, emailOTP } from 'better-auth/plugins';

import {
    OTP_ALLOWED_ATTEMPTS,
    OTP_EXPIRES_IN,
    OTP_LENGTH,
    PENDING_ACCOUNT_MERGE_COOKIE,
    PENDING_ACCOUNT_MERGE_MAX_AGE,
} from '@/auth/auth.constants';
import { accountMergePlugin } from '@/auth/plugins/account-merge';
import { prisma } from '@/db';
import { sendEmailOtp } from '@/email/email.service';
import { mergeAnonymousCart } from '@/services/cart/cart.service';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
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
    plugins: [
        anonymous({
            disableDeleteAnonymousUser: true,
            onLinkAccount: async ({ anonymousUser, newUser, ctx }) => {
                try {
                    await mergeAnonymousCart(
                        anonymousUser.user.id,
                        newUser.user.id,
                    );
                } catch (error) {
                    ctx.context.logger.error('Failed to merge anonymous cart', {
                        anonymousUserId: anonymousUser.user.id,
                        userId: newUser.user.id,
                        error,
                    });

                    await ctx.setSignedCookie(
                        PENDING_ACCOUNT_MERGE_COOKIE,
                        JSON.stringify({
                            anonymousUserId: anonymousUser.user.id,
                            userId: newUser.user.id,
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

                    return;
                }

                await ctx.context.internalAdapter.deleteUser(
                    anonymousUser.user.id,
                );
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
