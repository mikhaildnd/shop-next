import type { ReactNode } from 'react';

interface IssueMessageProps {
    title: string;
    description: string;
    children?: ReactNode;
}

function IssueMessage({ title, description, children }: IssueMessageProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center rounded-md border border-(--color-primary)/50 bg-white py-20 text-center">
            <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
            <p className="mb-6 text-gray-500">{description}</p>
            {children}
        </div>
    );
}

export default IssueMessage;
