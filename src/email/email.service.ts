import type { EmailOtpType, SendEmailOtpParams } from '@/email/email.types';

import { resend } from './resend';

function getEmailOtpSubject(type: EmailOtpType) {
    switch (type) {
        case 'email-verification':
            return 'Подтверждение электронной почты';

        case 'sign-in':
            return 'Код для входа';

        case 'forget-password':
            return 'Код для восстановления пароля';

        case 'change-email':
            return 'Код для смены электронной почты';
    }
}

export async function sendEmailOtp({ email, otp, type }: SendEmailOtpParams) {
    const subject = getEmailOtpSubject(type);

    if (process.env.NODE_ENV === 'development') {
        console.log(`
====================================
🔐 ${subject}

Email: ${email}
Code:  ${otp}
====================================
`);

        return;
    }

    // Better Auth recommends not awaiting email sending to reduce timing attacks.
    // TODO: On Vercel/Cloudflare replace with waitUntil().
    return void resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: email,
        subject,
        html: `
            <h2>${subject}</h2>

            <p>Ваш код:</p>

            <h1>${otp}</h1>

            <p>Если вы не запрашивали этот код, просто проигнорируйте письмо.</p>
        `,
    });
}
