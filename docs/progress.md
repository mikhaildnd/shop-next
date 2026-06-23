# Progress

## Completed

### Search

- refactor(search): unify search endpoint
- refactor(search): move search logic into SearchInput
- refactor(search): remove useSearchInput
- refactor(search): simplify SearchDropdown responsibilities

### URL

- refactor(url): unify URL builders
- refactor(url): support boolean query params

### Product Listing

- refactor(catalog): use ProductListingLayout
- refactor(product): use common filters for search
- feat(breadcrumbs): add collection and search breadcrumbs

### Categories

- Category использует древовидную структуру
- добавлены categoryPath и descendantSlugs

### Pagination

- добавлены page и view=append
- реализованы canonical URL

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