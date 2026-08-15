'use client';

import { CircleUser, LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { signOut } from '@/auth/actions/sign-out';
import { ButtonLink } from '@/components/button/ButtonLink';
import { Dropdown } from '@/components/dropdown/Dropdown';
import type { ProfileUser } from '@/components/header/profile/profile.types';
import { cn } from '@/lib/cn';
import { routes } from '@/routes';

interface DesktopProfileProps {
    user: ProfileUser | null;
    className?: string;
}

export function DesktopProfile({ user, className }: DesktopProfileProps) {
    const [isOpen, setIsOpen] = useState(false);

    const menuItemClassName =
        'flex items-center gap-2 rounded p-2 text-sm transition-colors hover:bg-gray-100';

    const menuGroupClassName =
        'px-2 [&>:not(:last-child)]:border-b [&>:not(:last-child)]:border-gray-200';

    const menuIconClassName = 'size-4 stroke-[2px]';
    return (
        <Dropdown
            isOpen={isOpen}
            onOpenChange={setIsOpen}
        >
            <Dropdown.Trigger asChild>
                <button
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

                    <span className="text-xs">
                        {user ? 'Профиль' : 'Войти'}
                    </span>
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content className="flex w-64 flex-col rounded-lg border border-gray-100">
                <p className="border-b border-gray-200 px-4 py-3 text-center">
                    <span className="font-semibold">
                        {user ? user.name : 'Гость'}
                    </span>
                </p>

                {user ? (
                    <div className={menuGroupClassName}>
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
                    <div className={menuGroupClassName}>
                        <div className="flex flex-col gap-2 py-2">
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
            </Dropdown.Content>
        </Dropdown>
    );
}
