import { useEffect } from 'react';

type UseEscapeKeyOptions = {
    onEscape: () => void;
};

export function useEscapeKey({ onEscape }: UseEscapeKeyOptions) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onEscape]);
}
