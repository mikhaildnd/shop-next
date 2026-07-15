import { Search as IconSearch, X as IconClose } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';

import { cn } from '@/utils/cn';

interface SearchFormProps {
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onFocus: () => void;
    onSubmit: SubmitEventHandler<HTMLFormElement>;
    onReset: () => void;
    className?: string;
}

export function SearchForm({
    value,
    onSubmit,
    onChange,
    onFocus,
    onReset,
    className,
}: SearchFormProps) {
    const iconButtonClass =
        'rounded p-1 transition-colors hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--color-primary) cursor-pointer md:p-1.5';

    return (
        <form
            className={cn('relative w-full', className)}
            onSubmit={onSubmit}
            autoComplete="off"
        >
            <input
                className="h-10 w-full no-search-cancel rounded border border-(--color-primary)/60 bg-gray-50 p-2 pr-16 text-base leading-[150%] text-black transition-colors placeholder:text-(--placeholder-text-color) focus:border-(--color-primary) focus:bg-white focus:ring-1 focus:ring-(--color-primary)/20 focus:outline-none"
                autoComplete="off"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder="Найти товар"
                type="search"
            />

            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center md:right-2 md:gap-2">
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
                    <IconSearch className="size-5 text-gray-500 transition-colors" />
                </button>
            </div>
        </form>
    );
}
