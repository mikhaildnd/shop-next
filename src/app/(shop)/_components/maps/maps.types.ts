interface Shop {
    id: number;
    coordinates: [number, number];
    name: string;
}

interface Location {
    name: string;
    center: [number, number];
    shops: Shop[];
}

export interface Locations {
    [key: string]: Location;
}
