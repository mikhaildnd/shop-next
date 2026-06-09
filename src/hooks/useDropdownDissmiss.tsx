import { type RefObject, useEffect } from 'react';

interface UseDropdownDismissOptions<T extends HTMLElement> {
    ref: RefObject<T | null>;
    onClickOutside: () => void;
    onEscape?: () => void;
}

export function useDropdownDismiss<T extends HTMLElement>({
    ref,
    onClickOutside,
    onEscape,
}: UseDropdownDismissOptions<T>) {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClickOutside();
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape?.();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [ref, onClickOutside, onEscape]);
}
