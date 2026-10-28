import { Search as IconSearch } from 'lucide-react';
import type { ChangeEvent, SubmitEventHandler } from 'react';

import { CloseButton } from '@/components/button/CloseButton';
import { IconButton } from '@/components/button/IconButton';
import { cn } from '@/lib/cn';

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
    return (
        <form
            className={cn('relative w-full', className)}
            onSubmit={onSubmit}
            autoComplete="off"
        >
            <input
                className="h-10 w-full no-search-cancel rounded-md border border-(--color-primary)/60 bg-gray-50 p-2 pr-16 text-base leading-[150%] text-black transition-colors placeholder:text-(--placeholder-text-color) focus:border-(--color-primary) focus:bg-white focus:ring-1 focus:ring-(--color-primary)/20 focus:outline-none"
                autoComplete="off"
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                placeholder="Найти товар"
                type="search"
            />

            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1 md:right-2 md:gap-2">
                {value && (
                    <CloseButton
                        aria-label="Очистить поиск"
                        onClick={onReset}
                        size="sm"
                    />
                )}

                <IconButton
                    type="submit"
                    size="sm"
                    shape="rounded"
                >
                    <IconSearch />
                </IconButton>
            </div>
        </form>
    );
}
