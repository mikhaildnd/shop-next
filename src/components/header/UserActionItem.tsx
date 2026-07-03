import type { ComponentType, SVGProps } from 'react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface UserActionItemProps {
    Icon: IconType;
    text?: string;
    className?: string;
}

export function UserActionItem(props: UserActionItemProps) {
    const { Icon, text, className } = props;

    return (
        <li className={className}>
            <a
                className="flex cursor-pointer flex-col items-center gap-1.5 p-2"
                href="/"
            >
                <Icon
                    aria-label={text}
                    className="size-5.5 stroke-[1.5px]"
                />
                <span className="text-xs">{text}</span>
            </a>
        </li>
    );
}
