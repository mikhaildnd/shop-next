import clsx from 'clsx';
import SearchButton from '@/components/header/SearchButton';
import SearchInput from '@/components/header/SearchInput';

const SearchBar = ({ className }: { className?: string }) => {
    return (
        <div className={clsx('flex grow gap-4', className)}>
            <SearchButton />
            <SearchInput />
        </div>
    );
};

export default SearchBar;
