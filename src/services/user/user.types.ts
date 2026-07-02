export type UserRole = 'ADMIN' | 'USER';

export type UserDto = {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phone: string | null;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
};
