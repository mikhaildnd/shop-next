'use client';

import { useEffect } from 'react';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { BREAKPOINTS } from '@/lib/breakpoints';

export function useMobileSearchOverlay(isOpen: boolean, onClose: () => void) {
    useLockBodyScroll(isOpen);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const mediaQuery = window.matchMedia(
            `(min-width: ${BREAKPOINTS.md}px)`,
        );

        const handleChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                onClose();
            }
        };

        // Close the mobile search overlay when switching to the desktop layout.
        // The component stays mounted because visibility is controlled by CSS.
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, [isOpen, onClose]);
}
