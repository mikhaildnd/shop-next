export function validateCurrentPassword(password: string): string | undefined {
    if (!password) {
        return 'Введите текущий пароль';
    }
}
