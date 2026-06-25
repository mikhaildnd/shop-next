# Current State

## Stack

- Next.js 16 (App Router)
- TypeScript
- Prisma 7
- PostgreSQL
- Tailwind CSS v4
- pnpm

---

## Database

Проект использует PostgreSQL и Prisma.

### Product

Product содержит:

- images
- category
- collections

Используются:

- regularPrice
- salePrice
- effectivePrice
- discountPercent
- ratingRate
- ratingCount

Связи:

- Product → Category : one-to-many
- Product ↔ Collection : many-to-many

### Category

Category представляет древовидную структуру:

```text
parent
└── children
```

Product принадлежит одной категории.

### Collection

Collection используется для:

- Новинки
- Акции

Связь Product ↔ Collection — many-to-many.

---

## Search

Используется:

- `/api/search`
- страница `/search`

Поиск выполняется через:

- debounced запросы;
- AbortController;
- общий endpoint `/api/search`.

Состояние поиска находится внутри `SearchInput`.

SearchDropdown получает готовые результаты и отвечает только за отображение.

---

## Product Listing

Общий Product Listing используется для:

- category page;
- collection page;
- search page.

Через `ProductListingLayout`.

Поддерживаются:

- query
- sale
- discount
- priceFrom
- priceTo
- sort
- page
- view=append

Параметры проходят через normalize-функции.

Метаданные фильтров формируются на сервере.

Сейчас включают:

- minPrice
- maxPrice
- totalProductsCount
- availableDiscounts

Фильтр скидок отображает только доступные пороги для текущего каталога (категории, коллекции или результатов поиска).

---

## Pagination

Используются:

- page
- view=append

Поддерживаются canonical URL.

Активная страница пагинации не является ссылкой.

URL пагинации строятся через `createPaginationUrl()` и `createLoadMoreUrl()`.

---

## Categories

Используется древовидная структура категорий.

Для навигации применяются:

- categoryPath
- descendantSlugs

---

## Services

Домены:

- product
- category
- collection
- user

Типы располагаются рядом с доменами.

---

## Components

Page-specific компоненты располагаются рядом с page.tsx.

Переиспользуемые компоненты находятся в `components`.

Общие компоненты нескольких страниц могут располагаться выше page-specific компонентов.

```text
app/(shop)/(catalog)/_components
```

---

## Hooks

В hooks находятся преимущественно переиспользуемые хуки.

Feature-хуки допускаются и могут располагаться рядом со своим доменом.

---

## Routes

Используются page routes:

- homePage()
- catalogPage()
- categoryPage()
- collectionPage()
- productPage()
- searchPage()

API routes располагаются отдельно:

- routes.api.search()

URL строятся через `buildUrl()`.

---

## URL

buildUrl поддерживает параметры:

- string
- number
- boolean

undefined-параметры автоматически исключаются.

---

## Search constants

Используются:

- SEARCH_QUERY_PARAM
- MIN_SEARCH_QUERY_LENGTH