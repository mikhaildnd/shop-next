'use client';

import CatalogButton from '@/components/header/CatalogButton';
import SearchInput from '@/components/header/search/SearchInput';
import { cn } from '@/utils/cn';
import { usePathname, useSearchParams } from 'next/navigation';

const SearchBar = ({ className }: { className?: string }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchKey = `${pathname}?${searchParams.toString()}`;

    return (
        <div className={cn('flex grow gap-4', className)}>
            <CatalogButton />
            <SearchInput key={searchKey} />
        </div>
    );
};

export default SearchBar;
