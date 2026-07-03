import { GoToCatalogButton } from '@/components/page-issues/ui/GoToCatalogButton';
import { IssueMessage } from '@/components/page-issues/ui/IssueMessage';

interface EmptyProductStateProps {
    title?: string;
    description?: string;
}

export function EmptyProductState({
    title = 'Товары не найдены',
    description = 'Попробуйте изменить параметры поиска',
}: EmptyProductStateProps) {
    return (
        <IssueMessage
            title={title}
            description={description}
        >
            <GoToCatalogButton />
        </IssueMessage>
    );
}
