import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from '@/auth/auth.consts';

export function validateName(name: string): string | undefined {
    const normalizedName = name.trim();

    if (!normalizedName) {
        return 'Введите имя';
    }

    if (normalizedName.length < NAME_MIN_LENGTH) {
        return `Имя слишком короткое (минимальная длина: ${NAME_MIN_LENGTH})`;
    }

    if (normalizedName.length > NAME_MAX_LENGTH) {
        return `Имя слишком длинное (максимальная длина: ${NAME_MAX_LENGTH})`;
    }
}
