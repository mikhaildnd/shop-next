import type { ReactNode } from 'react';

interface FilterSectionProps {
    title?: string;
    children?: ReactNode;
}

const FilterSection = ({ title, children }: FilterSectionProps) => {
    return (
        <section className="space-y-3">
            <h3 className="font-medium">{title}</h3>

            {children}
        </section>
    );
};

export default FilterSection;
