import {
    Folder as IconFolder,
    History as IconHistory,
    X as IconClose,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import {
    getSearchHistoryItemHref,
    getSearchHistoryItemTitle,
} from '@/lib/search/search-history';
import type { SearchHistoryItem } from '@/lib/search/search-history.types';

interface SearchHistoryItemProps {
    item: SearchHistoryItem;
    onRemove: (item: SearchHistoryItem) => void;
    onSelect: () => void;
}

export function SearchHistoryItem({
    item,
    onRemove,
    onSelect,
}: SearchHistoryItemProps) {
    return (
        <li className="group/item flex items-center rounded transition-colors focus-within:bg-gray-50 focus-within:ring-1 focus-within:ring-(--color-primary) focus-within:ring-inset hover:bg-gray-50">
            <Link
                onClick={onSelect}
                href={getSearchHistoryItemHref(item)}
                className="flex min-w-0 grow items-center gap-x-2 px-3 py-1.5 focus-visible:outline-none"
            >
                <div className="flex size-8 shrink-0 items-center justify-center">
                    {item.type === 'query' && (
                        <IconHistory className="size-5 text-gray-300 transition-colors group-focus-within/item:text-gray-800 group-hover/item:text-gray-800" />
                    )}

                    {item.type === 'category' && (
                        <IconFolder className="size-5 fill-white text-gray-300 transition-colors group-focus-within/item:text-yellow-400 group-hover/item:text-yellow-400" />
                    )}

                    {item.type === 'product' &&
                        (item.thumbnail ? (
                            <Image
                                src={item.thumbnail}
                                alt=""
                                width={28}
                                height={28}
                                className="rounded border border-gray-300 object-cover transition-colors group-focus-within/item:border-(--color-primary) group-hover/item:border-(--color-primary)"
                            />
                        ) : (
                            <div className="size-7 rounded border border-gray-200 bg-gray-100" />
                        ))}
                </div>

                <span className="grow truncate text-gray-800">
                    {getSearchHistoryItemTitle(item)}
                </span>
            </Link>

            <button
                type="button"
                aria-label="Удалить элемент истории"
                onClick={() => onRemove(item)}
                className="group/remove mr-2 shrink-0 cursor-pointer rounded p-1 transition-colors hover:bg-gray-200 focus-visible:bg-gray-200 focus-visible:ring-1 focus-visible:ring-(--color-primary) focus-visible:outline-none md:p-1.5"
            >
                <IconClose className="size-5 text-gray-300 transition-colors group-hover/remove:text-gray-800 group-focus-visible/remove:text-gray-800" />
            </button>
        </li>
    );
}
