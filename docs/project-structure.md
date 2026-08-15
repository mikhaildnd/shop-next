# Project Structure

## app/

Маршруты Next.js.

* страницы;
* layouts;
* route handlers;
* page-specific компоненты;
* page-specific hooks и чистая логика.

---

## components/

Глобально переиспользуемые UI-компоненты.

Используются несколькими доменами приложения.

---

## hooks/

Переиспользуемые React-хуки.

---

## services/

Сервисная логика проекта.

Содержит доменную и прикладную логику, связанную с конкретными областями проекта.

Структура зависит от потребностей конкретной области.

---

## lib/

Переиспользуемая техническая логика и константы, организованные по функциональным областям.

`lib` не содержит React-компонентов и JSX. Отдельные модули могут использовать API среды выполнения, если это является частью их ответственности.

---

## constants/

Общие константы проекта.

---

## types/

Общие типы, используемые несколькими доменами.

---

## auth/

Инфраструктура авторизации.

Содержит конфигурацию Better Auth, клиент, работу с сессией, auth-specific cookies, ошибки и validators.

Page-specific auth flow и связанные с ним Server Actions располагаются в app/auth/.

---

## email/

Инфраструктура отправки email.

Содержит email service, типы и интеграцию с Resend.

---

## db.ts

Общий Prisma database client.

---

## routes.ts

Централизованные page routes и API routes.

---

## prisma/

Prisma schema, миграции и seed.

---

## data/

Статические данные и seed-моки.

---

## generated/

Сгенерированный код.

Не редактируется вручную.

---

## public/

Статические файлы.

---

## docs/

Документация проекта.

* `current-state.md`
* `progress.md`
* `architecture.md`
* `project-structure.md`
* `style-guide.md`
* `principles.md`
