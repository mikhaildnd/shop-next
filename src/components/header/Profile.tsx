import { CircleUser } from 'lucide-react';

import { cn } from '@/utils/cn';

export function Profile({ className }: { className?: string }) {
    const isAuth = true;

    return (
        <div
            className={cn(
                'flex cursor-pointer flex-col items-center gap-1.5 p-2',
                className,
            )}
        >
            <CircleUser
                className={cn(
                    'size-5.5 stroke-[1.5px]',
                    isAuth && 'text-(--color-primary)',
                )}
            />

            <span className="text-xs">Войти</span>
        </div>
    );
}
