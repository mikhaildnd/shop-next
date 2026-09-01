import { GoToCatalogButton } from '@/app/(shop)/(catalog)/_components/page-issues/GoToCatalogButton';
import { PageMessage } from '@/components/PageMessage';

export function InvalidPageState() {
    return (
        <PageMessage
            title="Такой страницы не существует"
            description="Вернитесь в каталог"
        >
            <GoToCatalogButton />
        </PageMessage>
    );
}
