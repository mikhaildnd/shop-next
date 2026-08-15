import { GoToCatalogButton } from '@/app/(shop)/(catalog)/_components/page-issues/GoToCatalogButton';
import { IssueMessage } from '@/app/(shop)/(catalog)/_components/page-issues/IssueMessage';

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
