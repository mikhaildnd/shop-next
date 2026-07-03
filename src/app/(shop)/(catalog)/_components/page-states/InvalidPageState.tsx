import { GoToCatalogButton } from '@/components/page-issues/ui/GoToCatalogButton';
import { IssueMessage } from '@/components/page-issues/ui/IssueMessage';

export function InvalidPageState() {
    return (
        <IssueMessage
            title="Такой страницы не существует"
            description="Вернитесь в каталог"
        >
            <GoToCatalogButton />
        </IssueMessage>
    );
}
