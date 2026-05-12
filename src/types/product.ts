import { ObjectId } from 'mongodb';

type ProductMeasure =
    | {
          weight: string;
          volume?: never;
      }
    | {
          volume: string;
          weight?: never;
      };

interface ProductBase<TId> {
    _id: TId;

    slug: string;

    img: string;
    title: string;
    description: string;

    basePrice: number;
    discountPercent?: number;
    rating: number;

    categories: string[];
}

export type ProductDto = ProductBase<string> & ProductMeasure;

export type ProductDocument = ProductBase<ObjectId> & ProductMeasure;

export type ProductSeed = Omit<ProductDocument, '_id'>;
