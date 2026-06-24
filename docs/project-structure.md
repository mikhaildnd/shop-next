# Project Structure

## app/

Маршруты Next.js.

Page-specific компоненты располагаются рядом с page.tsx.

Общие компоненты нескольких страниц могут располагаться выше.

Например:

```text
app/
└── (shop)
    └── (catalog)
        ├── category
        ├── collection
        ├── search
        └── _components
```

---

## components/

Переиспользуемые UI-компоненты.

Структура строится по доменам:

```text
components/
├── header
├── footer
├── product
├── shared
```

---

## hooks/

Переиспользуемые хуки.

Feature-хуки допускаются и со временем могут перемещаться ближе к своему домену.

---

## services/

Доменная логика и работа с данными.

Структура домена может включать:

```text
product/
├── product.service.ts
├── product.types.ts
├── product.mapper.ts
└── use-cases
```

---

## lib/

Чистые функции и константы.

Структура строится по доменам.

Например:

```text
lib/
├── breadcrumbs
├── pagination
├── product
├── search
├── url
```

Избегать глобальных папок:

- helpers
- common
- utils

---

## data/

Статические данные и seed-моки.

---

## generated/

Сгенерированный код.

Не редактируется вручную.

---

## docs/

Документация проекта.

Основные документы:

- current-state.md
- progress.md
- architecture.md
- style-guide.md
- principles.md
- project-structure.md

---

## public/

Статические файлы.