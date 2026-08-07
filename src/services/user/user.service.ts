import { prisma } from '@/lib/db';
import { mapUserToDto } from '@/lib/mappers/user.mapper';
import type { UserDto } from '@/services/user/user.types';

export async function getUserById(id: string): Promise<UserDto | null> {
    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return null;
    }

    return mapUserToDto(user);
}

export async function updateUserName(
    userId: string,
    name: string,
): Promise<UserDto> {
    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name,
        },
    });

    return mapUserToDto(user);
}
