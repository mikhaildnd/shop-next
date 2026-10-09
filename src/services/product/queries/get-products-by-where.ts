import { prisma } from '@/db';
import type { Prisma } from '@/generated/prisma/client';
import { productInclude } from '@/services/product/product.constants';
import { mapProductToDto } from '@/services/product/product.mapper';
import type {
    ProductsData,
    ProductsDataWithCount,
} from '@/services/product/product.types';
import { getProductOrderBy } from '@/services/product/sort/get-product-order-by';
import type { ProductSort } from '@/services/product/sort/sort.types';

type GetProductsParams = {
    where?: Prisma.ProductWhereInput;
    take?: number;
    skip?: number;
    sort?: ProductSort;
    includeCount?: boolean;
};

interface GetProductsWithCountParams extends GetProductsParams {
    includeCount: true;
}

interface GetProductsWithoutCountParams extends GetProductsParams {
    includeCount?: false;
}

export async function getProductsByWhere(
    params: GetProductsWithCountParams,
): Promise<ProductsDataWithCount>;

export async function getProductsByWhere(
    params: GetProductsWithoutCountParams,
): Promise<ProductsData>;

export async function getProductsByWhere({
    where = {},
    take,
    skip = 0,
    sort,
    includeCount = false,
}: GetProductsParams): Promise<ProductsDataWithCount | ProductsData> {
    const [products, totalProductsCount] = await Promise.all([
        prisma.product.findMany({
            where,
            include: productInclude,
            skip,
            take,
            orderBy: getProductOrderBy(sort),
        }),
        includeCount ? prisma.product.count({ where }) : undefined,
    ]);

    return {
        products: products.map(mapProductToDto),
        ...(totalProductsCount !== undefined && { totalProductsCount }),
    };
}
