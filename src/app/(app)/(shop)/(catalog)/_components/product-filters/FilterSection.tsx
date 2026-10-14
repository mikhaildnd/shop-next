import type { ReactNode } from 'react';

interface FilterSectionProps {
    title?: string;
    children?: ReactNode;
}

export function FilterSection({ title, children }: FilterSectionProps) {
    return (
        <section>
            {title && (
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-700">
                        {title}
                    </h3>
                </div>
            )}
            {children}
        </section>
    );
}
