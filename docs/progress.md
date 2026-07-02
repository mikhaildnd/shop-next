# Progress

## Completed

### Search

- поиск использует единый API-эндпоинт
- логика поиска перенесена в `SearchInput`
- удалён хук `useSearchInput`
- `SearchDropdown` отвечает только за отображение результатов

### URL

- унифицировано построение URL
- добавлена поддержка boolean-параметров

### Product Listing

- выделен отдельный домен `lib/product-listing`
- `getProducts()` больше не зависит от URL
- парсинг URL вынесен в `parseProductListing()`
- построение Prisma query вынесено в `buildProductQuery()`
- используется общий `ProductListingLayout`
- поиск использует общие фильтры каталога
- добавлены хлебные крошки для коллекций и страницы поиска
- фильтр скидок получает доступные значения с сервера

### Categories

- категории используют древовидную структуру
- добавлены `categoryPath` и `descendantSlugs`

### Pagination

- добавлены page и view=append
- реализованы canonical URL
- улучшена навигация пагинации
- активная страница больше не является ссылкой

### Architecture

- page-specific компоненты располагаются рядом с page.tsx
- hooks содержат только переиспользуемые хуки
- типы перенесены ближе к доменам
- routes приведены к единому неймингу
- page components используют явные имена

### Code Style

- Props оформляются через interface
- предпочтение отдаётся export function
- утилиты используют kebab-case