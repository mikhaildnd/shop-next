import { createContext, useContext } from 'react';

interface DropdownContextValue {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
}

export const DropdownContext = createContext<DropdownContextValue | null>(null);

export function useDropdownContext() {
    const context = useContext(DropdownContext);

    if (!context) {
        throw new Error('Dropdown components must be used within Dropdown.');
    }

    return context;
}
