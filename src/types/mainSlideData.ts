import type { ComponentProps } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
