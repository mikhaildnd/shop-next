'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';

interface LazySectionProps {
    children: ReactNode;
    fallback?: ReactNode;
    rootMargin?: string | number;
    lazy?: boolean;
}

function normalizeRootMargin(value: number | string): string {
    if (typeof value === 'number') return `${value}px`;

    return /^-?\d+(\.\d+)?(px|%|em|rem|vh|vw)$/.test(value) ? value : '0px';
}

export function LazySection({
    children,
    fallback = null,
    rootMargin = '200px',
    lazy = true,
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement | null>(null);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!lazy) {
            return;
        }

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: normalizeRootMargin(rootMargin) },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [rootMargin, lazy]);

    return <div ref={ref}>{!lazy || isVisible ? children : fallback}</div>;
}
