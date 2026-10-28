import { redirect } from 'next/navigation';

import { DeleteAccountButton } from '@/app/(app)/(shop)/profile/_components/DeleteAccountButton';
import { ProfileBadge } from '@/app/(app)/(shop)/profile/_components/ProfileBadge';
import { ProfileItem } from '@/app/(app)/(shop)/profile/_components/ProfileItem';
import { ProfileName } from '@/app/(app)/(shop)/profile/_components/ProfileName';
import { ProfilePassword } from '@/app/(app)/(shop)/profile/_components/ProfilePassword';
import { ProfileSection } from '@/app/(app)/(shop)/profile/_components/ProfileSection';
import { getAuthenticatedUser } from '@/auth/session';
import { ButtonLink } from '@/components/button/ButtonLink';
import { routes } from '@/routes';

export default async function ProfilePage() {
    const user = await getAuthenticatedUser();

    if (!user) {
        redirect(routes.signInPage());
    }

    return (
        <div className="mx-auto page-spacing max-w-2xl">
            <h1 className="mt-6 mb-4 text-2xl font-semibold lg:mt-10 lg:text-3xl">
                Профиль
            </h1>

            <div className="flex flex-col gap-10">
                <ProfileSection title="Личные данные">
                    <div className="space-y-6">
                        <ProfileName name={user.name} />

                        <ProfileItem
                            label="Email"
                            action={
                                <ButtonLink
                                    href={routes.changeEmailPage()}
                                    variant="neutral"
                                    size="sm"
                                >
                                    Изменить
                                </ButtonLink>
                            }
                        >
                            <div className="flex flex-col gap-2">
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
                    <DeleteAccountButton />
                </ProfileSection>
            </div>
        </div>
    );
}
