import { Search as IconSearch, X as IconClose } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';

import { cn } from '@/utils/cn';

interface SearchFormProps {
    value: string;
    isLoading: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onSubmit: SubmitEventHandler<HTMLFormElement>;
    onReset: () => void;
    className?: string;
}

export function SearchForm({
    value,
    onSubmit,
    isLoading,
    onChange,
    onFocus,
    onReset,
    className,
}: SearchFormProps) {
    const iconButtonClass =
        'rounded p-1 md:p-1.5 text-gray-500 transition-colors hover:bg-gray-100 cursor-pointer';

    return (
        <form
            className={cn('relative w-full', className)}
            onSubmit={onSubmit}
            autoComplete="off"
        >
            <input
                className="h-10 w-full no-search-cancel rounded bg-gray-50 p-2 pr-16 text-base leading-[150%] text-black outline outline-(--color-primary) placeholder:text-(--placeholder-text-color) focus:bg-white focus:shadow-(--shadow-button-default)"
                autoComplete="off"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder="Найти товар"
                type="search"
            />

            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center md:right-2 md:gap-2">
                {isLoading && (
                    <div className="size-4 animate-spin rounded-full border-2 border-gray-300 border-t-(--color-primary)" />
                )}
                {value && (
                    <button
                        type="button"
                        onClick={onReset}
                        aria-label="Очистить поиск"
                        className={iconButtonClass}
                    >
                        <IconClose className="size-5 text-gray-500 transition-colors" />
                    </button>
                )}

                <button
                    type="submit"
                    aria-label="Поиск"
                    className={iconButtonClass}
                >
                    <IconSearch className="size-5 text-gray-500" />
                </button>
            </div>
        </form>
    );
}
