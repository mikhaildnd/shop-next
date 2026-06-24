# Style Guide

## Цель

Style Guide фиксирует соглашения по написанию кода и неймингу.

Предпочтения помогают поддерживать единый стиль проекта, но не должны превращаться в догмы.

Последовательность важнее идеального соответствия стилю.

---

## Exports

Предпочитать именованные экспорты.

Предпочтительно:

```ts
export function ProductCard() {}
```

Допускается:

```ts
export const ProductCard = () => {};
```

если это делает код более читаемым.

---

## Props

Для Props использовать `interface`.

Пример:

```ts
interface ProductCardProps {
  product: ProductDto;
}
```

---

## Types

Для остальных структур использовать `type`.

Примеры:

```ts
type ProductSort =
  | 'newest'
  | 'popular'
  | 'price-asc';

type ProductFilters = {
  saleOnly: boolean;
};
```

---

## Components

Компоненты используют PascalCase.

Примеры:

```text
ProductCard.tsx
SearchInput.tsx
MainSlider.tsx
ProductPriceFilter.tsx
```

Если компонент используется только одной страницей, располагать его рядом с `page.tsx`.

Не выносить компонент в глобальную папку заранее.

---

## Pages

Страницы используют явные имена.

Предпочтительно:

```ts
export default function ProductPage() {}
```

Избегать:

```ts
export default function Page() {}
```

---

## Hooks

Хуки используют camelCase.

Примеры:

```text
useDismiss.ts
useSliderNavigation.ts
useUpdateProductFilters.ts
```

---

## File Naming

Утилиты, функции и небольшие модули используют kebab-case.

Примеры:

```text
normalize-sort-param.ts
get-product-order-by.ts
build-catalog-breadcrumbs.ts
create-pagination-url.ts
```

---

## Services

Сервисы используют формат:

```text
product.service.ts
category.service.ts
collection.service.ts
```

---

## Types Files

Типы располагаются рядом с доменом.

Формат:

```text
product.types.ts
category.types.ts
collection.types.ts
```

---

## Mappers

Mappers используют формат:

```text
product.mapper.ts
user.mapper.ts
```

---

## Constants

Константы используют UPPER_SNAKE_CASE.

Примеры:

```ts
PRODUCTS_PER_PAGE
SEARCH_QUERY_PARAM
MIN_SEARCH_QUERY_LENGTH
```

Файлы:

```text
consts.ts
config.ts
```

---

## Functions

Предпочитать небольшие специализированные функции.

Избегать функций-обёрток без дополнительной ценности.

Нежелательно:

```ts
export function getProductsCount(products: Product[]) {
  return products.length;
}
```

---

## Routes

Page routes используют формат:

```ts
homePage()
catalogPage()
categoryPage()
collectionPage()
productPage()
searchPage()
```

API routes располагаются отдельно:

```ts
routes.api.search()
```

---

## URL Helpers

Функции используют глагол в начале.

Примеры:

```text
build-url.ts
create-pagination-url.ts
get-pagination-params.ts
normalize-sort-param.ts
```

---

## Composition

Предпочитать composition over abstraction.

Новые абстракции добавлять только при наличии реальной пользы.

Не создавать дополнительные слои заранее.

---

## Refactoring

Предпочитать небольшие локальные рефакторинги.

Не выполнять крупные перестройки без необходимости.

Избегать рефакторинга ради рефакторинга.

---

## React

Предпочитать локальное состояние, пока не появилась необходимость в его выносе.

Состояние должно находиться максимально близко к месту использования.

---

## Services

Доменная логика располагается в `services`.

Не дробить сервисы преждевременно.

`use-cases` и дополнительные слои добавляются только при наличии реальной необходимости.

---

## Documentation

При изменении соглашений проекта необходимо обновлять документацию.

Изменения Style Guide должны отражать реально используемые практики проекта.
