export function validateConfirmPassword(
    password: string,
    confirmPassword: string,
): string | undefined {
    if (!confirmPassword) {
        return 'Подтвердите пароль';
    }

    if (password !== confirmPassword) {
        return 'Пароли не совпадают';
    }
}
