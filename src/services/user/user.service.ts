import { prisma } from '@/lib/db';
import { mapUserToDto } from '@/lib/mappers/user.mapper';
import type { UserDto } from '@/types/user';

export async function getUsers(): Promise<UserDto[]> {
    const users = await prisma.user.findMany({});

    return users.map(mapUserToDto);
}
