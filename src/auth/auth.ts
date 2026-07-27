import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { emailOTP } from 'better-auth/plugins';

import { sendEmailOtp } from '@/email/email.service';
import { prisma } from '@/lib/db';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        deleteUser: {
            enabled: true,
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                void sendEmailOtp({
                    email,
                    otp,
                    type,
                });
            },
        }),
    ],
});
