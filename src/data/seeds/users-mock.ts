import type { UserSeed } from '@/data/seeds/types';
import { UserRole } from '@/generated/prisma/client';

export const users: UserSeed[] = [
    {
        name: 'Mikhail',
        email: 'dundukovmi@gmail.com',
        emailVerified: true,
        phone: '+79991234567',
        role: UserRole.ADMIN,
    },
    {
        name: 'Ivan',
        email: 'user@example.com',
        emailVerified: true,
        phone: '+79997654321',
        role: UserRole.USER,
    },
];
