# Naming

## Components

Компоненты используют PascalCase.

Примеры:

- ProductCard.tsx
- SearchInput.tsx
- MainSlider.tsx
- ProductPriceFilter.tsx

---

## Pages

Страницы используют явные имена.

Примеры:

- HomePage
- CatalogPage
- CategoryPage
- CollectionPage
- ProductPage
- SearchPage

Избегать:

```ts
export default function Page() {}
```

---

## Hooks

Хуки используют camelCase.

Примеры:

- useDismiss.ts
- useClickOutside.ts
- useEscapeKey.ts
- useUpdateProductFilters.ts

---

## Utils

Утилиты и функции используют kebab-case.

Примеры:

- normalize-sort-param.ts
- get-product-order-by.ts
- build-catalog-breadcrumbs.ts
- create-pagination-url.ts

---

## Services

Сервисы используют формат:

- product.service.ts
- category.service.ts
- collection.service.ts

---

## Types

Типы располагаются рядом с доменом.

Формат:

- product.types.ts
- category.types.ts
- collection.types.ts

---

## Mappers

Mappers используют формат:

- product.mapper.ts
- user.mapper.ts

---

## Constants

Константы используют UPPER_SNAKE_CASE.

Примеры:

- PRODUCTS_PER_PAGE
- SEARCH_QUERY_PARAM
- MIN_SEARCH_QUERY_LENGTH

Файлы:

- consts.ts
- config.ts

---

## Routes

Page routes используют формат:

- homePage()
- catalogPage()
- categoryPage()
- collectionPage()
- productPage()
- searchPage()

API routes располагаются отдельно:

- routes.api.search()

---

## URL helpers

Функции используют глагол в начале.

Примеры:

- build-url.ts
- create-pagination-url.ts
- get-pagination-params.ts
- normalize-sort-param.ts