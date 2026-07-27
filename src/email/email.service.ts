import { resend } from './resend';

// type SendVerificationEmailParams = {
//     email: string;
//     url: string;
// };
//
// export async function sendVerificationEmail({
//     email,
//     url,
// }: SendVerificationEmailParams) {
//     await resend.emails.send({
//         from: process.env.EMAIL_FROM!,
//         to: email,
//         subject: 'Подтвердите адрес электронной почты',
//         html: `
//             <h2>Подтверждение регистрации</h2>
//
//             <p>Спасибо за регистрацию.</p>
//
//             <p>
//                 <a href="${url}">
//                     Подтвердить адрес электронной почты
//                 </a>
//             </p>
//         `,
//     });
// }

type SendEmailOtpParams = {
    email: string;
    otp: string;
    type: 'email-verification' | 'sign-in' | 'forget-password' | 'change-email';
};

function getEmailOtpSubject(type: SendEmailOtpParams['type']) {
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

    await resend.emails.send({
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
