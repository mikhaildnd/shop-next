'use client';

import { useEffect, useState } from 'react';

type ScrollDirection = 'up' | 'down' | null;

interface ScrollState {
    direction: ScrollDirection;
    scrollY: number;
}

export function useScrollDirection(): ScrollState {
    const [scrollDirection, setScrollDirection] =
        useState<ScrollDirection>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        let previousScrollY = window.scrollY;

        function handleScroll() {
            const currentScrollY = window.scrollY;

            setScrollY(currentScrollY);

            if (currentScrollY <= 0) {
                setScrollDirection('up');
            } else {
                setScrollDirection(
                    currentScrollY > previousScrollY ? 'down' : 'up',
                );
            }

            previousScrollY = currentScrollY;
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return {
        direction: scrollDirection,
        scrollY,
    };
}
