import { redirect } from 'next/navigation';

import { ProfileBadge } from '@/app/(shop)/profile/_components/ProfileBadge';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { ProfileName } from '@/app/(shop)/profile/_components/ProfileName';
import { ProfilePassword } from '@/app/(shop)/profile/_components/ProfilePassword';
import { ProfileSection } from '@/app/(shop)/profile/_components/ProfileSection';
import { deleteAccount } from '@/app/(shop)/profile/actions';
import { getAuthenticatedUser } from '@/auth/session';
import { Button } from '@/components/button/Button';
import { ButtonLink } from '@/components/button/ButtonLink';
import { SubmitButton } from '@/components/button/SubmitButton';
import { DeletionDialog } from '@/components/DeletionDialog';
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
                    <div className="flex flex-col items-start gap-3">
                        <DeletionDialog
                            trigger={
                                <Button
                                    size="sm"
                                    variant="destructive"
                                >
                                    Удалить аккаунт
                                </Button>
                            }
                            title="Удалить аккаунт?"
                            description="Восстановить аккаунт будет невозможно."
                            confirmAction={
                                <form action={deleteAccount}>
                                    <SubmitButton
                                        className="w-full"
                                        size="sm"
                                        variant="destructive"
                                        pendingText="Удаление аккаунта"
                                    >
                                        Удалить аккаунт
                                    </SubmitButton>
                                </form>
                            }
                        />
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
}
