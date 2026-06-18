import MenuIcon from '../../../public/icons-header/icon-menu.svg';

const CatalogButton = () => {
    return (
        <button className="hidden w-10 cursor-pointer gap-4 rounded bg-(--color-primary) p-2 duration-300 hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) md:flex lg:w-35">
            <MenuIcon
                //TODO проверить ариа
                aria-label="Меню"
                className="hidden size-6 md:block"
            />
            <span className="hidden text-base text-white lg:block">
                Каталог
            </span>
        </button>
    );
};

export default CatalogButton;
