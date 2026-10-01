type AsyncAction = () => Promise<void>;

export interface ActionQueue {
    enqueue: (action: AsyncAction) => Promise<void>;
}

export function createActionQueue(): ActionQueue {
    let queue = Promise.resolve();

    return {
        enqueue(action) {
            const next = queue.then(action, action);

            queue = next.catch(() => undefined);

            return next;
        },
    };
}
