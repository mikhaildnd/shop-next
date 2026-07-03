import type Image from 'next/image';
import type Link from 'next/link';
import type { ComponentProps } from 'react';

type ImageType = ComponentProps<typeof Image>;
type LinkType = ComponentProps<typeof Link>;
interface SlideText {
    title?: string;
    description?: string;
}

export interface MainSlideData {
    id: string;
    image: ImageType;
    link?: LinkType;
    slideText?: SlideText;
}
