import { ButtonLink } from '@/components/button/ButtonLink';
import { PageMessage } from '@/components/PageMessage';
import { routes } from '@/routes';

export function InvalidPageState() {
    return (
        <PageMessage title="Такой страницы не существует">
            <ButtonLink href={routes.catalogPage()}>В каталог</ButtonLink>
        </PageMessage>
    );
}
