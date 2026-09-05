import { Trash2Icon } from 'lucide-react';
import { redirect } from 'next/navigation';

import { ProfileBadge } from '@/app/(shop)/profile/_components/ProfileBadge';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { ProfileName } from '@/app/(shop)/profile/_components/ProfileName';
import { ProfilePassword } from '@/app/(shop)/profile/_components/ProfilePassword';
import { ProfileSection } from '@/app/(shop)/profile/_components/ProfileSection';
import { deleteAccount } from '@/app/(shop)/profile/actions';
import { getSession } from '@/auth/session';
import { Button } from '@/components/button/Button';
import { ButtonLink } from '@/components/button/ButtonLink';
import { SubmitButton } from '@/components/button/SubmitButton';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { routes } from '@/routes';
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
                        <AlertDialog>
                            <AlertDialogTrigger
                                render={
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                    >
                                        Удалить аккаунт
                                    </Button>
                                }
                            />
                            <AlertDialogContent size="default">
                                <AlertDialogHeader>
                                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                                        <Trash2Icon />
                                    </AlertDialogMedia>
                                    <AlertDialogTitle>
                                        Удалить аккаунт?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Восстановить аккаунт будет невозможно
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel
                                        render={
                                            <Button
                                                size="sm"
                                                variant="neutral"
                                            >
                                                Отмена
                                            </Button>
                                        }
                                    />
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
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
}
