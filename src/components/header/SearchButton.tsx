import Image from 'next/image';
import SearchImage from '../../../public/icons-header/icon-search.svg';

const SearchButton = () => {
    return (
        <button className="hidden w-10 cursor-pointer gap-4 rounded bg-(--color-primary) p-2 duration-300 hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) md:flex lg:w-35">
            <Image
                src={SearchImage}
                alt="menu"
                width={24}
                height={24}
                className="hidden md:block"
            />
            <span className="hidden text-base text-white lg:block">
                Каталог
            </span>
        </button>
    );
};

export default SearchButton;
