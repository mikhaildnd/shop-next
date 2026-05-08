import Image from 'next/image';
import Link from 'next/link';

interface UserBlockItemProps {
    src: string;
    text?: string;
    width?: number;
    height?: number;
    alt: string;
    className?: string;
}

const UserActionItem = (props: UserBlockItemProps) => {
    const { src, text, width = 24, height = 24, alt, className } = props;

    return (
        <li className={className}>
            <Link
                className="flex cursor-pointer flex-col items-center gap-1.5 p-2"
                href="/1"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="h-6 w-6 object-contain"
                />
                <span className="text-xs">{text}</span>
            </Link>
        </li>
    );
};

export default UserActionItem;
