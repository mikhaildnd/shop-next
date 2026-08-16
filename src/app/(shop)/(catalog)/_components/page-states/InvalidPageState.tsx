import { GoToCatalogButton } from '@/app/(shop)/(catalog)/_components/page-issues/GoToCatalogButton';
import { IssueMessage } from '@/app/(shop)/(catalog)/_components/page-issues/IssueMessage';

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
