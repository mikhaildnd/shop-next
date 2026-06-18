# Progress

## Search

- SearchInput стал UI-компонентом.
- Логика поиска вынесена в useSearchInput.
- useDropdownDismiss разделён на:
  - useClickOutside
  - useEscapeKey
  - useDismiss

## Categories

- Category имеет древовидную структуру.
- Для навигации используется categoryPath.

## Pagination

- Поддерживаются page и view=append.
- Добавлены canonical URL.