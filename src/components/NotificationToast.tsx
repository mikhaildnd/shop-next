interface NotificationToastProps {
    message: string;
}

export function NotificationToast({ message }: NotificationToastProps) {
    return (
        <div
            role="alert"
            className="fixed bottom-[calc(var(--bottom-nav-height)+10px)] left-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-md sm:right-4 sm:w-auto md:bottom-4 md:left-auto md:translate-x-0 lg:right-10 lg:bottom-10"
        >
            {message}
        </div>
    );
}
