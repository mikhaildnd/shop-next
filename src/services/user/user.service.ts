import { prisma } from '@/lib/db';
import { mapUserToDto } from '@/lib/mappers/user.mapper';
import type { UserDto } from '@/services/user/user.types';

//TODO вынести маппинг и в других сервисах тоже
export async function getUsers(): Promise<UserDto[]> {
    const users = await prisma.user.findMany({});

    return users.map(mapUserToDto);
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            emailVerified: true,
        },
    });
}
