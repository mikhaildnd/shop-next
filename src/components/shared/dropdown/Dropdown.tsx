'use client';

import type { JSX, ReactNode } from 'react';
import { useRef, useState } from 'react';

import { useDismiss } from '@/hooks/useDismiss';
import { cn } from '@/utils/cn';

import { DropdownContent } from './DropdownContent';
import { DropdownContext } from './DropdownContext';
import { DropdownTrigger } from './DropdownTrigger';

interface DropdownProps {
    children: ReactNode;
    className?: string;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

interface DropdownComponent {
    (props: DropdownProps): JSX.Element;
    Trigger: typeof DropdownTrigger;
    Content: typeof DropdownContent;
}

export const Dropdown: DropdownComponent = ({
    children,
    className,
    isOpen,
    onOpenChange,
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const isControlled = isOpen !== undefined;
    const currentIsOpen = isControlled ? isOpen : internalIsOpen;

    const setOpen = (value: boolean) => {
        if (!isControlled) {
            setInternalIsOpen(value);
        }

        onOpenChange?.(value);
    };

    const toggle = () => setOpen(!currentIsOpen);
    const close = () => setOpen(false);

    useDismiss({
        ref: containerRef,
        onClickOutside: close,
        onEscape: close,
    });

    return (
        <DropdownContext.Provider
            value={{ isOpen: currentIsOpen, toggle, close }}
        >
            <div
                ref={containerRef}
                className={cn('relative', className)}
            >
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

Dropdown.Trigger = DropdownTrigger;
Dropdown.Content = DropdownContent;
