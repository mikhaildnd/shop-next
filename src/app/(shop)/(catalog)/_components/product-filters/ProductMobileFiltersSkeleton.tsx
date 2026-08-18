import { cn } from '@/lib/cn';

interface ProductMobileFiltersSkeletonProps {
    className?: string;
}

export function ProductMobileFiltersSkeleton({
    className,
}: ProductMobileFiltersSkeletonProps) {
    return (
        <div
            className={cn(
                'h-10 w-10 animate-pulse rounded-xl bg-gray-200',
                className,
            )}
        />
    );
}
