import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';

import { OTP_EXPIRES_IN } from '@/auth/auth.consts';
import { sendEmailOtp } from '@/email/email.service';
import { prisma } from '@/lib/db';

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
        emailOTP({
            overrideDefaultEmailVerification: true,
            changeEmail: {
                enabled: true,
            },
            sendVerificationOTP: sendEmailOtp,
            sendVerificationOnSignUp: true,
            otpLength: 6,
            allowedAttempts: 3,
            expiresIn: OTP_EXPIRES_IN,
            resendStrategy: 'rotate',
        }),
        nextCookies(), // must be last
    ],
});
