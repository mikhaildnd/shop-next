import Link from 'next/link';
import Image from 'next/image';
import type { MainSlideData } from '@/types/mainSlideData';

interface SlideProps extends Omit<MainSlideData, 'id'> {}

const Slide = ({ image, link, slideText }: SlideProps) => {
    const SlideContent = (
        <div className="relative h-full bg-gray-300">
            <Image
                {...image}
                fill
                className="object-cover"
            />
            {slideText && (
                <div className="absolute inset-0 mb-14 flex flex-col items-center justify-end px-8 py-4 text-white">
                    {slideText.title && (
                        <h2 className="mb-3 max-w-[70%] text-5xl">
                            {slideText.title}
                        </h2>
                    )}
                    {slideText.description && (
                        <p className="text-3xl">{slideText.description}</p>
                    )}
                </div>
            )}
        </div>
    );

    if (link?.href) {
        return (
            <Link
                {...link}
                className={link.className}
            >
                {SlideContent}
            </Link>
        );
    }

    return SlideContent;
};

export default Slide;
