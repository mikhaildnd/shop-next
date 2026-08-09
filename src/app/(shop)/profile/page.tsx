import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ProfileBadge } from '@/app/(shop)/profile/_components/ProfileBadge';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { ProfileName } from '@/app/(shop)/profile/_components/ProfileName';
import { ProfilePassword } from '@/app/(shop)/profile/_components/ProfilePassword';
import { ProfileSection } from '@/app/(shop)/profile/_components/ProfileSection';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { getSession } from '@/auth/session';
import { routes } from '@/lib/routes';
import { getUserById } from '@/services/user/user.service';
import { deleteAccount, signOut } from '@/app/(shop)/profile/actions';

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect(routes.signInPage());
    }

    const user = await getUserById(session.user.id);

    if (!user) {
        return null;
    }

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mt-10 mb-4 text-3xl font-semibold">Профиль</h1>

            <div className="flex flex-col gap-10">
                <ProfileSection title="Личные данные">
                    <div className="space-y-6">
                        <ProfileName name={user.name} />

                        <ProfileItem
                            label="Email"
                            action={
                                <Link
                                    className="link-style"
                                    href={routes.changeEmailPage()}
                                >
                                    Изменить
                                </Link>
                            }
                        >
                            <div className="flex items-center gap-2">
                                <p>{user.email}</p>

                                <ProfileBadge text="Подтвержден" />
                            </div>
                        </ProfileItem>
                    </div>
                </ProfileSection>

                <ProfilePassword />

                <ProfileSection
                    title="Удаление аккаунта"
                    variant="destructive"
                >
                    <div className="flex flex-col items-start gap-3">
                        <form action={deleteAccount}>
                            <SubmitButton
                                variant="destructive"
                                pendingText="Удаление аккаунта"
                            >
                                Удалить аккаунт
                            </SubmitButton>
                        </form>

                        <form action={signOut}>
                            <SubmitButton pendingText="Выход">
                                Выйти
                            </SubmitButton>
                        </form>
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
}
