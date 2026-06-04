import type { User } from '@/generated/prisma/client';
import type { UserDto } from '@/types/user';

export function mapUserToDto(user: User): UserDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    };
}
