import { GoToCatalogButton } from '@/app/(shop)/(catalog)/_components/page-issues/GoToCatalogButton';
import { PageMessage } from '@/components/PageMessage';

interface EmptyProductStateProps {
    title?: string;
    description?: string;
}

export function EmptyProductState({
    title = 'Товары не найдены',
    description = 'Попробуйте изменить параметры поиска',
}: EmptyProductStateProps) {
    return (
        <PageMessage
            title={title}
            description={description}
        >
            <GoToCatalogButton />
        </PageMessage>
    );
}
