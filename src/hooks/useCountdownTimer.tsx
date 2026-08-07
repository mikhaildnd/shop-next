'use client';

import { useEffect, useState } from 'react';

export function useCountdownTimer(seconds: number) {
    const [secondsLeft, setSecondsLeft] = useState(seconds);

    useEffect(() => {
        // Reset countdown when a new duration arrives.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSecondsLeft(seconds);

        if (seconds <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setSecondsLeft((value) => Math.max(value - 1, 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds]);

    return {
        secondsLeft,
    };
}
