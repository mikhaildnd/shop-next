import MenuIcon from '../../../public/icons-header/icon-menu.svg';

export function CatalogButton() {
    return (
        <button className="flex w-10 cursor-pointer gap-4 rounded bg-(--color-primary) p-2 duration-300 hover:shadow-(--shadow-button-default) active:shadow-(--shadow-button-active) lg:w-35">
            <MenuIcon
                aria-label="Каталог"
                className="size-6"
            />
            <span className="hidden text-base text-white lg:block">
                Каталог
            </span>
        </button>
    );
}
