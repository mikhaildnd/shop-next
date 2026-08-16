import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { emailOTP } from 'better-auth/plugins';

import {
    OTP_ALLOWED_ATTEMPTS,
    OTP_EXPIRES_IN,
    OTP_LENGTH,
} from '@/auth/auth.constants';
import { prisma } from '@/db';
import { sendEmailOtp } from '@/email/email.service';

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
            otpLength: OTP_LENGTH,
            allowedAttempts: OTP_ALLOWED_ATTEMPTS,
            expiresIn: OTP_EXPIRES_IN,
            resendStrategy: 'rotate',
        }),
        nextCookies(), // must be last
    ],
});
