type AsyncAction<T> = () => Promise<T>;

export interface ActionQueue {
    enqueue: <T>(action: AsyncAction<T>) => Promise<T>;
}

export function createActionQueue(): ActionQueue {
    let queue = Promise.resolve();

    return {
        enqueue<T>(action: AsyncAction<T>) {
            const next = queue.then(action, action);
            queue = next.then(
                () => undefined,
                () => undefined,
            );

            return next;
        },
    };
}
