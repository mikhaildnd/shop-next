# Current State

## Stack

* Next.js 16 (App Router)
* TypeScript
* Prisma 7
* PostgreSQL
* Tailwind CSS v4
* pnpm

---

## Database

Проект использует PostgreSQL и Prisma.

---

## Search

Используется:

* `/api/search`
* страница `/search`

Поиск выполняется через:

* debounced-запросы;
* AbortController;
* общий endpoint `/api/search`.

`SearchDropdown` отвечает только за отображение результатов.

Устройство поиска:

* поиск использует общий `SearchContext`;
* состояние поиска инкапсулировано в `useSearch`;
* мобильная и десктопная версии используют общее состояние поиска;
* UI разделён на отдельные desktop/mobile компоненты.

---

## Product Listing

Общий Product Listing используется для:

* Category;
* Collection;
* Search.

Логика листинга сосредоточена в домене `product-listing`.

Поток данных:

```text
URL
    │
    ├── parseProductListing()
    ├── getPaginationParams()
    ▼
getProducts()
    │
    ▼
buildProductWhere()
    │
    ▼
Prisma
```

Поддерживаются параметры:

* query
* sale
* inStock
* discount
* priceFrom
* priceTo
* sort
* page
* view=append

`parseProductListing()` преобразует URL в нормализованную модель фильтров и сортировки.

`getPaginationParams()` независимо обрабатывает параметры пагинации.

`getProducts()` получает уже нормализованные данные и не зависит от URL.

Фильтры каталога используют серверные метаданные:

* minPrice
* maxPrice
* maxDiscount
* totalProductsCount

---

## Product Listing UI

Каталог использует единый `ProductListingLayout`.

Он объединяет:

* Filters
* Sort
* ProductGrid
* Pagination
* Load More

Фильтры разделены на отдельные layout-компоненты:

* `DesktopFilters`
* `MobileFilters`

Оба используют общий `ProductFiltersPanel`, который отвечает только за композицию набора фильтров.

Для полноэкранных мобильных панелей используется `useLockBodyScroll`.

`ProductGrid` отвечает только за отображение списка товаров.

---

## Page States

Страницы каталога используют единый механизм отображения состояний.

Используются:

* PageStateLayout
* PageIssues
* EmptyProductState
* InvalidPageState

Состояния страницы обрабатываются отдельно от Product Listing.

---

## Pagination

Используются:

* page
* view=append

URL формируются через:

* `createPaginationUrl()`
* `createLoadMoreUrl()`

Активная страница не является ссылкой.

---

## Catalog

Страницы:

* Category
* Collection
* Search

используют единый поток:

* parseProductListing();
* getPaginationParams();
* getProducts();
* ProductListingLayout;
* PageStateLayout.

Страница каталога категорий использует отдельную модель представления.

Поток данных:

```text
CategoryDto[]
        │
        ▼
mapCategoriesToCatalogSections()
        │
        ▼
CatalogSection[]
        │
        ├── CatalogDesktop
        └── CatalogMobile