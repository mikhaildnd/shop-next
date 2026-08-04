'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCountdownTimerResult {
    restart: (seconds: number) => void;
    secondsLeft: number;
}

export function useCountdownTimer(initialSeconds = 0): UseCountdownTimerResult {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimer = useCallback(() => {
        if (!intervalRef.current) {
            return;
        }

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    const restart = useCallback(
        (seconds: number) => {
            clearTimer();

            setSecondsLeft(seconds);

            intervalRef.current = setInterval(() => {
                setSecondsLeft((value) => {
                    if (value <= 1) {
                        clearTimer();
                        return 0;
                    }

                    return value - 1;
                });
            }, 1000);
        },
        [clearTimer],
    );

    useEffect(() => {
        if (initialSeconds <= 0) {
            return;
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft((value) => {
                if (value <= 1) {
                    clearTimer();
                    return 0;
                }

                return value - 1;
            });
        }, 1000);

        return clearTimer;
    }, [clearTimer, initialSeconds]);

    return {
        restart,
        secondsLeft,
    };
}
