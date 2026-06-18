# Style Guide

## Functions

Предпочитать:

export function

для:

* компонентов;
* хуков;
* utils;
* services;
* guards;
* normalizers;
* mappers.

Допускается использование export const, если это делает код более читаемым.

## Props

Props компонентов оформляются через interface.

Пример:

interface ProductCardProps {
product: ProductDto;
}

## Остальные структуры

Предпочитать type.

Пример:

type CreateUrlParams = {
searchParams: SearchParams;
};

## Local functions

Локальные функции внутри компонентов обычно оформляются через const.

Пример:

const handleSubmit = () => {};

## Constants

Константы оформляются через export const.
