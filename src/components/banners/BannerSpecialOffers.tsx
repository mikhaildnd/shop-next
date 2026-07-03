import Image from 'next/image';

import { BannerCard } from '@/components/banners/BannerCard';

import LoyaltyCardImage from '../../../public/images/banners/loyalty_card_proto.png';

export function BannerSpecialOffers() {
    return (
        <section>
            <div className="flex flex-col text-[#414141]">
                <h2 className="mb-4 text-left text-2xl font-bold md:mb-8 xl:text-4xl">
                    Специальные предложения
                </h2>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <BannerCard
                        className="bg-(--color-green)"
                        bannerText={{
                            title: 'Оформите карту нашего магазина',
                            description: 'И получайте бонусы при покупках',
                            textColor: 'white',
                            textHorizontalPosition: 'center',
                            textVerticalPosition: 'center',
                        }}
                        href="/"
                    />
                    <BannerCard
                        className="bg-(--color-orange) hover:shadow-(--shadow-card-shop)"
                        bannerText={{
                            textColor: 'white',
                            title: 'Покупайте акционные товары',
                            description: 'И получайте вдвое больше бонусов',
                            textVerticalPosition: 'center',
                        }}
                        href="/"
                    >
                        <Image
                            src={LoyaltyCardImage}
                            alt="Акционные товары"
                            width={220}
                            height={110}
                            className="absolute top-1/2 left-3/4 h-auto w-auto -translate-x-1/2 -translate-y-1/2 rotate-10 transform xl:w-[210px]"
                        />
                    </BannerCard>
                </div>
            </div>
        </section>
    );
}
