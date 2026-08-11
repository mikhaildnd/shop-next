import type { ReactNode } from 'react';

interface ProfileItemProps {
    label: string;
    children?: ReactNode;
    action?: ReactNode;
}

export function ProfileItem({ label, children, action }: ProfileItemProps) {
    return (
        <div className="flex items-center justify-between gap-6">
            <div className="flex flex-col gap-2 break-all">
                <p className="text-sm font-medium">{label}</p>

                {children}
            </div>

            {action}
        </div>
    );
}
