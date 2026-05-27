import Link from 'next/link';
import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface UserActionItemProps {
    Icon: IconType;
    text?: string;
    className?: string;
}

const UserActionItem = (props: UserActionItemProps) => {
    const { Icon, text, className } = props;

    return (
        <li className={className}>
            <Link
                className="flex cursor-pointer flex-col items-center gap-1.5 p-2"
                href="/1"
            >
                <Icon
                    aria-label={text}
                    className="size-5.5 stroke-[1.5px]"
                />
                <span className="text-xs">{text}</span>
            </Link>
        </li>
    );
};

export default UserActionItem;
