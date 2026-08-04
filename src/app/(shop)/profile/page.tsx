import { DeleteUserButton } from '@/app/(shop)/profile/_components/DeleteUserButton';
import { SignOutButton } from '@/app/(shop)/profile/_components/SignOutButton';
import { getSession } from '@/auth/session';

export default async function ProfilePage() {
    const session = await getSession();

    return (
        <main className="container py-10">
            <h1 className="mb-6 text-3xl font-semibold">Профиль</h1>

            <pre>{JSON.stringify(session, null, 2)}</pre>

            <SignOutButton />
            <DeleteUserButton />
        </main>
    );
}
