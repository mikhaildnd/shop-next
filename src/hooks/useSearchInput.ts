import {
    Dispatch,
    SubmitEvent,
    RefObject,
    SetStateAction,
    type SubmitEventHandler,
    useRef,
    useState,
    useEffect,
} from 'react';
import { SearchResponse } from '@/services/search/types';
import { SEARCH_QUERY_PARAM } from '@/lib/search/consts';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDismiss } from '@/hooks/useDismiss';
import { routes } from '@/lib/routes';
import { searchProducts } from '@/lib/api/search';
import { useDebounce } from '@/hooks/useDebounce';

type UseSearchInputReturn = {
    containerRef: RefObject<HTMLDivElement | null>;
    query: string;
    isOpen: boolean;
    isLoading: boolean;
    results: SearchResponse | null;
    searchUrl: string;
    setQuery: Dispatch<SetStateAction<string>>;
    setIsOpen: Dispatch<SetStateAction<boolean>>;

    resetSearch(): void;
    handleSubmit(e: SubmitEvent<HTMLFormElement>): void;
};

export function useSearchInput(): UseSearchInputReturn {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const containerRef = useRef<HTMLDivElement>(null);

    const isSearchPage = pathname.startsWith('/search');
    const initialQuery = isSearchPage
        ? (searchParams.get(SEARCH_QUERY_PARAM) ?? '')
        : '';

    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<SearchResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const searchQuery = query.trim();
    const searchUrl = routes.search(searchQuery);
    const debouncedQuery = useDebounce(query, 300);

    const resetSearch = () => {
        setQuery('');
        setResults(null);
        setIsLoading(false);
        setIsOpen(false);
    };

    useDismiss({
        ref: containerRef,
        onClickOutside: () => setIsOpen(false),
        onEscape: resetSearch,
    });

    useEffect(() => {
        const debouncedSearchQuery = debouncedQuery.trim();

        const controller = new AbortController();

        if (debouncedSearchQuery.length < 2) {
            setResults(null);
            setIsOpen(false);
            setIsLoading(false);

            return () => controller.abort();
        }

        setIsLoading(true);

        searchProducts(debouncedSearchQuery, controller.signal)
            .then((data) => {
                setResults(data);

                if (!isSearchPage) {
                    setIsOpen(true);
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error(error);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [debouncedQuery]);

    useEffect(() => {
        if (isSearchPage) {
            setQuery(searchParams.get(SEARCH_QUERY_PARAM) ?? '');
        } else {
            resetSearch();
        }
    }, [isSearchPage, searchParams]);

    const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        if (searchQuery.length < 2) {
            return;
        }

        setIsOpen(false);

        router.push(searchUrl);
    };

    return {
        containerRef,
        query,
        isOpen,
        isLoading,
        results,
        searchUrl,
        setQuery,
        setIsOpen,
        resetSearch,
        handleSubmit,
    };
}
