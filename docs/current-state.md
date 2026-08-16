# Current State

## Stack

* Next.js 16.3.1 (App Router)
* React 19.2.8
* TypeScript 5.9.3
* Prisma 7.9.1
* PostgreSQL 17
* Tailwind CSS v4
* Better Auth
* Resend
* pnpm 11.17.0
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

Каталог использует единый layout для Product Listing, включающий фильтрацию, сортировку, отображение товаров и управление пагинацией.

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

В каталоге доступны:

* страница каталога с категориями товаров;
* страницы отдельных категорий;
* страницы коллекций;
* страница поиска.

Страницы отдельных категорий, коллекций и поиска используют общий Product Listing.

---

## Product Domain

Работа с товарами организована через доменный сервис, DTO и общий Product Listing.

Страница товара использует отдельные page-specific компоненты для отображения информации о товаре и слайдера изображений.

---

## Header and Navigation

Header поддерживает desktop и mobile navigation.

Navigation интегрирована с состоянием авторизации и предоставляет доступ к основным разделам магазина.

---

## Maps

Карта магазинов реализована на основе Yandex Maps.

Реализованы:

* переключение города;
* отображение магазинов на карте;
* кастомные placemarks;
* loading skeleton;
* обновление центра карты при переключении города.

---

## Authentication

В проекте интегрирован Better Auth.

Текущий authentication flow основан на email.

Реализованы:

* sign in по email и паролю;
* sign up по email и паролю;
* email verification через OTP;
* password reset;
* установка нового пароля;
* смена email;
* подтверждение нового email;
* sign out.

Email отправляется через отдельный email service.

Для защиты auth-операций используется rate limiting.

---

## Profile

Профиль доступен авторизованным пользователям.

Пользователь может управлять данными своего аккаунта.

---

## CI

Для проекта настроен GitHub Actions CI.

CI запускается на:

* `push`;
* `pull_request`.

CI проверяет проект в чистом окружении, включая установку зависимостей, работу с базой данных, проверки кода и production build.