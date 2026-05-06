import type { Locations } from '@/types/shops';

export const locations: Locations = {
    almaty: {
        name: 'Алматы',
        center: [43.15, 76.54],
        shops: [
            { id: 1, coordinates: [43.15, 76.54], name: 'Магазин на Гоголя' },
            { id: 2, coordinates: [43.14, 76.55], name: 'Магазин на Абая' },
            {
                id: 3,
                coordinates: [43.13, 76.56],
                name: 'Магазин на Тимирязева',
            },
        ],
    },
    saintPetersburg: {
        name: 'Санкт-Петербург',
        center: [59.57, 30.19],
        shops: [
            {
                id: 4,
                coordinates: [59.57, 30.19],
                name: 'Магазин на Московском',
            },
            {
                id: 5,
                coordinates: [59.56, 30.2],
                name: 'Магазин на Марата',
            },
        ],
    },
};
