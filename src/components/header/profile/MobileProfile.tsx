'use client';

import { CircleUser, LogOut,UserRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { signOut } from '@/auth/actions/sign-out';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { ButtonLink } from '@/components/shared/button/ButtonLink';
import { CloseButton } from '@/components/shared/button/CloseButton';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { routes } from '@/lib/routes';
import { cn } from '@/utils/cn';

interface MobileProfileProps {
    user: ProfileUser | null;
    className?: string;
}

export function MobileProfile({ user, className }: MobileProfileProps) {
    const [isOpen, setIsOpen] = useState(false);

    useLockBodyScroll(isOpen);

    const menuItemClassName =
        'flex items-center gap-2 rounded p-2 text-sm transition-colors hover:bg-gray-100';

    const menuGroupClassName =
        'px-2 [&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-gray-200';

    const menuIconClassName = 'size-4 stroke-[2px]';
    return (
        <div>
            <button
                onClick={() => setIsOpen(true)}
                type="button"
                className={cn(
                    'flex cursor-pointer flex-col items-center gap-1.5 p-1',
                    className,
                )}
            >
                <span className="relative">
                    <CircleUser className="size-5.5 stroke-[1.5px] text-black" />

                    {user && (
                        <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-(--color-primary) ring-2 ring-white" />
                    )}
                </span>

                <span className="text-xs">{user ? 'Профиль' : 'Войти'}</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 flex flex-col bg-white">
                    <div className="flex shrink-0 justify-between border-b border-gray-200 p-4">
                        <p className="text-lg">
                            <span className="font-semibold">
                                {user ? user.name : 'Гость'}
                            </span>
                        </p>
                        <CloseButton
                            aria-label="Закрыть профиль"
                            onClick={() => setIsOpen(false)}
                        />
                    </div>

                    {user ? (
                        <div
                            className={cn(
                                menuGroupClassName,
                                'min-h-0 flex-1 overflow-y-auto',
                            )}
                        >
                            <div className="flex flex-col py-2">
                                <Link
                                    className={menuItemClassName}
                                    href={routes.profilePage()}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <UserRound className={menuIconClassName} />
                                    Профиль
                                </Link>
                            </div>

                            <div className="flex flex-col py-2">
                                <form action={signOut}>
                                    <button
                                        className={cn(
                                            'w-full cursor-pointer',
                                            menuItemClassName,
                                        )}
                                    >
                                        <LogOut className={menuIconClassName} />
                                        Выйти
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                menuGroupClassName,
                                'min-h-0 flex-1 content-center overflow-y-auto',
                            )}
                        >
                            <div className="flex flex-col gap-6 py-2">
                                <ButtonLink
                                    size="sm"
                                    href={routes.signInPage()}
                                    onClick={() => setIsOpen(false)}
                                >
                                    Вход
                                </ButtonLink>

                                <ButtonLink
                                    size="sm"
                                    href={routes.signUpPage()}
                                    variant="outline"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Регистрация
                                </ButtonLink>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
