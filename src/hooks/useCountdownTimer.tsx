'use client';

import { useEffect, useState } from 'react';

interface CountdownTimer {
    secondsLeft: number;
    isRunning: boolean;
}

export function useCountdownTimer(expiresAt?: number): CountdownTimer {
    const [isReady, setIsReady] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
        const update = () => {
            const secondsLeft = getSecondsLeft(expiresAt);

            setIsReady(true);
            setSecondsLeft(secondsLeft);
        };

        update();

        if (!expiresAt) {
            return;
        }

        const interval = setInterval(update, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    return {
        secondsLeft,
        isRunning: isReady && secondsLeft > 0,
    };
}

function getSecondsLeft(expiresAt?: number) {
    if (!expiresAt) {
        return 0;
    }

    return Math.max(Math.ceil((expiresAt - Date.now()) / 1000), 0);
}
