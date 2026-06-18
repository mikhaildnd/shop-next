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

Проект полностью переведён с MongoDB на PostgreSQL.

Используется Prisma.

---

## Product

Product содержит:

* images
* category
* collections

Используются ratingRate и ratingCount.

Product → Category : one-to-many

Product ↔ Collection : many-to-many

---

## Category

Category представляет дерево:

parent → children.

Product принадлежит одной категории.

---

## Collection

Collection используется для:

* Новинки
* Акции

Связь Product ↔ Collection many-to-many.

---

## Search

Используется:

* /api/search
* страница /search
* useSearchInput
* debounce
* AbortController

SearchInput является преимущественно UI-компонентом.

---

## Filters

Фильтрация реализована через URLSearchParams.

Поддерживаются:

* sale
* discount
* priceFrom
* priceTo
* sort

Параметры проходят через normalize.

---

## Pagination

Используются:

* page
* view=append

Поддерживаются canonical URL.

---

## Services

Домены:

* product
* category
* collection
* search
* user

---

## Categories

Используется древовидная структура категорий.

Для навигации применяется categoryPath.

Для запросов используются descendantSlugs.

---

## Components

Page-specific компоненты располагаются рядом с page.tsx.

Переиспользуемые компоненты находятся в components.

---

## Hooks

useDropdownDismiss разделён на:

* useClickOutside
* useEscapeKey
* useDismiss

useSearchInput содержит логику поиска.

---

## Search constants

Используются:

* SEARCH_QUERY_PARAM
* MIN_SEARCH_QUERY_LENGTH
