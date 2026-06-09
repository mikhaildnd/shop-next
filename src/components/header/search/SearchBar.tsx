import CatalogButton from '@/components/header/CatalogButton';
import SearchInput from '@/components/header/search/SearchInput';
import { cn } from '@/utils/cn';

const SearchBar = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex grow gap-4', className)}>
            <CatalogButton />
            <SearchInput />
        </div>
    );
};

export default SearchBar;
