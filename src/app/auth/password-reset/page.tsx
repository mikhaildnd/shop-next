import { AuthSurface } from '@/app/auth/_components/AuthSurface';
import { PasswordResetForm } from '@/app/auth/password-reset/_components/PasswordResetForm';

export default async function PasswordResetPage() {
    return (
        <AuthSurface>
            <AuthSurface.Header
                title="Сброс пароля"
                description="Введите адрес электронной почты вашей учетной записи, и мы вышлем вам код для сброса пароля."
            />
            <PasswordResetForm />
        </AuthSurface>
    );
}
