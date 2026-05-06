import Image from 'next/image';
import IconSearch from '../../../public/icons-header/icon-search.svg';

const SearchInput = () => {
    return (
        <div className="relative grow">
            <input
                type="text"
                placeholder="Найти товар"
                className="h-10 w-full rounded p-2 text-base leading-[150%] text-black outline outline-(--color-primary) placeholder:text-(--placeholder-text-color) focus:shadow-(--shadow-button-default)"
            />
            <button className="absolute top-2 right-2 cursor-pointer">
                <Image
                    src={IconSearch}
                    alt="Поиск"
                    width={24}
                    height={24}
                />
            </button>
        </div>
    );
};

export default SearchInput;
