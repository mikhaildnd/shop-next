import { cn } from '@/utils/cn';

interface ProductPropertyProps {
    title: string;
    content: string;
    className?: string;
}

export function ProductProperty({
    title,
    content,
    className,
}: ProductPropertyProps) {
    return (
        <section className={cn('space-y-1', className)}>
            <h2 className="text-xl font-semibold">{title}:</h2>

            <p className="text-md leading-6 text-neutral-700">{content}</p>
        </section>
    );
}
