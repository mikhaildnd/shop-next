import UserMenu from '@/components/header/UserMenu';
import SearchBar from '@/components/header/search/SearchBar';
import Logo from '@/components/logo/Logo';

const Header = () => {
    return (
        <header className="relative z-10 flex wrapper items-center gap-x-4 bg-white py-3 md:gap-x-5 md:py-4 md:shadow-(--shadow-default) xl:gap-x-6">
            <Logo className="shrink-0" />
            <SearchBar className="shrink" />
            <UserMenu className="fixed right-0 bottom-0 left-0 z-50 ml-auto" />
        </header>
    );
};

export default Header;
