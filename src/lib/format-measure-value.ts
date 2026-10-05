import type { MeasureType } from '@/services/product/product.types';

export function formatMeasureValue(value: number, type: MeasureType): string {
    switch (type) {
        case 'GRAM':
            return value >= 1000 ? `${value / 1000} кг` : `${value} г`;

        case 'MILLILITER':
            return value >= 1000 ? `${value / 1000} л` : `${value} мл`;

        case 'PIECE':
            return `${value} шт.`;
    }
}
