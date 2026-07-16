import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open, onOpenChange]);

    if (!open) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-50">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => onOpenChange(false)}
            />

            <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl">
                {children}
            </div>
        </div>,
        document.body,
    );
}
