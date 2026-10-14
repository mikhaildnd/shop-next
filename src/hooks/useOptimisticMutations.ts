import { useCallback, useRef, useState } from 'react';

import type { ActionQueue } from '@/lib/async/action-queue';

interface UseOptimisticMutationsOptions<T> {
    initialData: T;
    actionQueue: ActionQueue;
}

interface OptimisticMutation<T> {
    update: (data: T) => T;
    action: () => Promise<T | void>;
}

interface UseOptimisticMutationsResult<T> {
    data: T;
    getData: () => T;
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

    const getData = useCallback(
        () =>
            pendingMutationsRef.current.reduce(
                (currentData, mutation) => mutation.update(currentData),
                confirmedDataRef.current,
            ),
        [],
    );

    const updateVisibleData = useCallback(() => {
        setData(getData());
    }, [getData]);

    const mutate = useCallback(
        (mutation: OptimisticMutation<T>): Promise<void> => {
            pendingMutationsRef.current.push(mutation);
            updateVisibleData();

            const execute = async () => {
                try {
                    const result = await mutation.action();

                    confirmedDataRef.current =
                        result === undefined
                            ? mutation.update(confirmedDataRef.current)
                            : result;
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

    return { data, mutate, replace, getData };
}
