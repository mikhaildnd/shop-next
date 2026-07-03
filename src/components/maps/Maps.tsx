'use client';

import { Map, Placemark, YMaps } from '@iminside/react-yandex-maps';
import { useState } from 'react';

import { locations } from '@/data/locations';
import { cn } from '@/utils/cn';

function MapAreaSkeleton() {
    return (
        <div className="absolute inset-0 z-10 h-[354px] w-full animate-pulse rounded-2xl bg-gray-200" />
    );
}

export function Maps() {
    const [currentLocation, setCurrentLocation] = useState('almaty');
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const currentLocationData = locations[currentLocation];

    return (
        <YMaps
            query={{
                lang: 'ru_RU',
                apikey: process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY,
                load: 'package.full',
            }}
        >
            <section>
                <div className="flex flex-col">
                    <h2 className="mb-4 text-left text-2xl font-bold md:mb-8 xl:mb-10 xl:text-4xl">
                        Наши магазины
                    </h2>

                    <div className="mb-5 flex flex-wrap gap-x-2 gap-y-3">
                        {Object.keys(locations).map((key) => {
                            const isActive = currentLocation === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => setCurrentLocation(key)}
                                    className={cn(
                                        'cursor-pointer rounded p-2 text-xs transition-shadow duration-200 active:shadow-(--shadow-button-active)',
                                        isActive
                                            ? 'bg-(--color-primary) text-white hover:shadow-(--shadow-button-default)'
                                            : 'bg-[#f3f2f1] hover:shadow-(--shadow-button-secondary)',
                                    )}
                                >
                                    {locations[key].name}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative">
                        {!isMapLoaded && <MapAreaSkeleton />}

                        <Map
                            defaultState={{
                                center: currentLocationData.center,
                                zoom: 9,
                            }}
                            state={{
                                center: currentLocationData.center,
                                zoom: 9,
                            }}
                            width="100%"
                            height={354}
                            onLoad={() => setIsMapLoaded(true)}
                        >
                            {currentLocationData.shops.map((shop) => (
                                <Placemark
                                    key={shop.id}
                                    geometry={shop.coordinates}
                                    options={{
                                        iconLayout: 'default#image',
                                        iconImageHref:
                                            '/icons-map/icon-location.svg',
                                        iconImageSize: [32, 32],
                                        iconOffset: [-16, -16],
                                    }}
                                    properties={{
                                        hintContent: shop.name,
                                    }}
                                />
                            ))}
                        </Map>
                    </div>
                </div>
            </section>
        </YMaps>
    );
}
