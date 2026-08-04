import type { ReactNode } from 'react';

interface AuthSurfaceFooterProps {
    children: ReactNode;
}

export function AuthSurfaceFooter({ children }: AuthSurfaceFooterProps) {
    return <div>{children}</div>;
}
