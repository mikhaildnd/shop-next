# Current State

## Stack

* Next.js 16.2.6 (App Router)
* React 19
* TypeScript
* Prisma 7
* PostgreSQL
* Tailwind CSS v4
* Better Auth
* Resend
* pnpm
* Turbopack

---

## Database

Проект использует PostgreSQL и Prisma.

Prisma используется для работы с доменными моделями и инфраструктурными моделями авторизации и rate limiting.

---

## Search

Используется:

* `/api/search`
* страница `/search`

Поиск выполняется через:

* debounced-запросы;
* отмену устаревших запросов;
* единый API endpoint.

Мобильная и десктопная версии используют общее состояние поиска.

История поиска хранится на клиенте в `localStorage`.

---

## Product Listing

Общий Product Listing используется для:

* Category;
* Collection;
* Search.

Логика листинга сосредоточена в app-слое каталога.

Поток данных:

```text
URL
    │
    ├── parsing и normalization
    ├── pagination
    ▼
Product Service
    │
    ▼
Prisma query
    │
    ▼
PostgreSQL
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

URL преобразуется в нормализованную модель фильтров и сортировки.

Пагинация обрабатывается независимо от фильтров и сортировки.

Product Service получает уже нормализованные данные и не зависит от URL.

Фильтры каталога используют серверные метаданные:

* minPrice
* maxPrice
* maxDiscount
* totalProductsCount

---

## Product Listing UI

Каталог использует единый layout для Product Listing.

В него входят:

* Filters
* Sort
* ProductGrid
* Pagination
* Load More

Desktop и mobile версии фильтров используют общую композицию.

Для полноэкранных мобильных панелей используется блокировка прокрутки body.

Отображение списка товаров отделено от управления фильтрами, сортировкой и пагинацией.

---

## Page States

Страницы каталога используют единый механизм отображения состояний.

Поддерживаются:

* loading;
* empty;
* invalid page;
* page issues.

Состояния страницы обрабатываются отдельно от Product Listing.

---

## Pagination

Используются:

* `page`
* `view=append`

URL формируются специализированными функциями.

Активная страница не является ссылкой.

---

## Catalog

Страницы:

* Category
* Collection
* Search

используют единый поток:

* parsing и normalization Product Listing;
* pagination;
* получение товаров;
* Product Listing UI;
* обработка состояний страницы.

Страница каталога категорий использует отдельную модель представления для desktop и mobile представлений.

---

## Product Domain

Работа с товарами организована через доменный сервис, DTO и общий Product Listing.

---

## Authentication

В проекте интегрирован Better Auth.

Инфраструктура авторизации располагается в src/auth. Page-specific auth flow и связанные с ним Server Actions располагаются в app/auth.

* конфигурация Better Auth и Prisma adapter;
* клиент Better Auth;
* работа с сессией;
* auth-specific cookies;
* обработка auth errors;

Реализованы следующие сценарии:

* sign in по email и паролю;
* sign up по email и паролю;
* email verification через OTP;
* password reset;
* установка нового пароля;
* смена email;
* подтверждение нового email;
* sign out.

Email отправляется через отдельный email service, использующий Resend.

Для защиты auth-операций используется отдельный rate-limit service.

