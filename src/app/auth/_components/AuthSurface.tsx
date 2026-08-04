import type { JSX, ReactNode } from 'react';

import { cn } from '@/utils/cn';

import { AuthSurfaceFooter } from './AuthSurfaceFooter';
import { AuthSurfaceHeader } from './AuthSurfaceHeader';

interface AuthSurfaceProps {
    className?: string;
    children: ReactNode;
}

interface AuthSurfaceComponent {
    (props: AuthSurfaceProps): JSX.Element;
    Header: typeof AuthSurfaceHeader;
    Footer: typeof AuthSurfaceFooter;
}

export const AuthSurface: AuthSurfaceComponent = ({ className, children }) => {
    return (
        <section
            className={cn(
                'mx-auto flex w-full max-w-100 flex-col gap-4 bg-white p-4 md:mt-20 md:rounded-2xl md:p-6',
                className,
            )}
        >
            {children}
        </section>
    );
};

AuthSurface.Header = AuthSurfaceHeader;
AuthSurface.Footer = AuthSurfaceFooter;
