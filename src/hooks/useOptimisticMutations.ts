import { useCallback, useRef, useState } from 'react';

import type { ActionQueue } from '@/lib/async/action-queue';

interface UseOptimisticMutationsOptions<T> {
    initialData: T;
    actionQueue: ActionQueue;
}

interface OptimisticMutation<T> {
    update: (data: T) => T;
    action: () => Promise<T>;
}

interface UseOptimisticMutationsResult<T> {
    data: T;
    mutate: (mutation: OptimisticMutation<T>) => Promise<void>;
    replace: (data: T) => void;
}

export function useOptimisticMutations<T>({
    initialData,
    actionQueue,
}: UseOptimisticMutationsOptions<T>): UseOptimisticMutationsResult<T> {
    const [data, setData] = useState(initialData);
    const confirmedDataRef = useRef(initialData);

    const pendingMutationsRef = useRef<OptimisticMutation<T>[]>([]);

    const updateVisibleData = useCallback(() => {
        const nextData = pendingMutationsRef.current.reduce(
            (currentData, mutation) => mutation.update(currentData),
            confirmedDataRef.current,
        );

        setData(nextData);
    }, []);

    const mutate = useCallback(
        (mutation: OptimisticMutation<T>): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleData();

            const execute = async () => {
                try {
                    confirmedDataRef.current = await mutation.action();
                } finally {
                    pendingMutationsRef.current =
                        pendingMutationsRef.current.filter(
                            (pendingMutation) => pendingMutation !== mutation,
                        );

                    updateVisibleData();
                }
            };

            return actionQueue.enqueue(execute);
        },
        [actionQueue, updateVisibleData],
    );

    const replace = useCallback(
        (nextData: T) => {
            confirmedDataRef.current = nextData;
            updateVisibleData();
        },
        [updateVisibleData],
    );

    return { data, mutate, replace };
}
