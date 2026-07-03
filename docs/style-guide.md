# Style Guide

## Цель

Style Guide фиксирует соглашения по написанию кода и неймингу.

Предпочтения помогают поддерживать единый стиль проекта, но не являются обязательными.

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

## Constants

Константы используют UPPER_SNAKE_CASE.

Примеры:

```ts
PRODUCTS_PER_PAGE
SEARCH_QUERY_PARAM
MIN_SEARCH_QUERY_LENGTH
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

## URL Helpers

Функции используют глагол в начале.

Примеры:

```text
build-url.ts
create-pagination-url.ts
get-pagination-params.ts
parse-sort-param.ts
```
