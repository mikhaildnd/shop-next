import type { RefObject } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useEscapeKey } from '@/hooks/useEscapeKey';

type UseDismissOptions<T extends HTMLElement> = {
    ref: RefObject<T | null>;
    onClickOutside: () => void;
    onEscape: () => void;
};

export function useDismiss<T extends HTMLElement>({
    ref,
    onClickOutside,
    onEscape,
}: UseDismissOptions<T>) {
    useClickOutside({ ref, onClickOutside });

    useEscapeKey({ onEscape });
}
