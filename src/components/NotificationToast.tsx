interface NotificationToastProps {
    message: string;
    loading?: boolean;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function NotificationToast({
    message,
    loading = false,
    action,
}: NotificationToastProps) {
    return (
        <div
            role="alert"
            className="fixed bottom-[calc(var(--bottom-nav-height)+10px)] left-1/2 z-50 flex w-[calc(100%-2rem)] min-w-75 -translate-x-1/2 items-center gap-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-md sm:right-4 sm:w-auto md:bottom-4 md:left-auto md:translate-x-0 lg:right-10 lg:bottom-10"
        >
            {loading && (
                <span
                    aria-hidden="true"
                    className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
                />
            )}

            <span className="min-w-0 flex-1">{message}</span>

            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="shrink-0 cursor-pointer font-medium underline"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
