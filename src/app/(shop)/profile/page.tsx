import Link from 'next/link';
import { redirect } from 'next/navigation';

import { DeleteUserButton } from '@/app/(shop)/profile/_components/DeleteUserButton';
import { ProfileBadge } from '@/app/(shop)/profile/_components/ProfileBadge';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { ProfileName } from '@/app/(shop)/profile/_components/ProfileName';
import { ProfileSection } from '@/app/(shop)/profile/_components/ProfileSection';
import { SignOutButton } from '@/app/(shop)/profile/_components/SignOutButton';
import { getSession } from '@/auth/session';
import { Button } from '@/components/shared/Button';
import { routes } from '@/lib/routes';
import { getUserById } from '@/services/user/user.service';

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
                                <Button
                                    variant="secondary"
                                    size="xs"
                                >
                                    <Link
                                        href={routes.profileChangeEmailPage()}
                                    >
                                        Изменить
                                    </Link>
                                </Button>
                            }
                        >
                            <div className="flex items-center gap-2">
                                <p>{user.email}</p>

                                <ProfileBadge text="Подтвержден" />
                            </div>
                        </ProfileItem>
                    </div>
                </ProfileSection>

                {/*TODO использовать ProfileItem*/}
                <ProfileSection title="Безопасность">
                    <div className="flex items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-black">
                                Пароль
                            </p>
                        </div>

                        <Button
                            variant="secondary"
                            size="xs"
                        >
                            Изменить
                        </Button>
                    </div>
                </ProfileSection>

                <ProfileSection
                    title="Удаление аккаунта"
                    variant="destructive"
                >
                    <div className="flex flex-col items-start gap-3">
                        <DeleteUserButton />
                        <SignOutButton />
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
}
