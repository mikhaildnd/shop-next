import type { MouseEventHandler, ReactElement } from 'react';
import { cloneElement } from 'react';

import { cn } from '@/utils/cn';

import { useDropdownContext } from './DropdownContext';

interface DropdownTriggerProps {
    children: ReactElement<{
        className?: string;
        onClick?: MouseEventHandler<HTMLElement>;
        'aria-expanded'?: boolean;
        'aria-haspopup'?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    }>;
    asChild?: boolean;
    className?: string;
}

export function DropdownTrigger({
    children,
    asChild = false,
    className,
}: DropdownTriggerProps) {
    const { isOpen, toggle } = useDropdownContext();

    if (asChild) {
        const handleClick: MouseEventHandler<HTMLElement> = (event) => {
            children.props.onClick?.(event);
            toggle();
        };

        return cloneElement(children, {
            onClick: handleClick,
            'aria-expanded': isOpen,
            'aria-haspopup': 'menu',
            className: cn(children.props.className, className),
        });
    }

    return (
        <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-haspopup="menu"
            className={className}
        >
            {children}
        </button>
    );
}
