import {
    PRODUCT_FILTER_PARAMS,
    PRODUCT_SORT_PARAM,
} from './product-listing.constants';

export function removeProductListingSearchParams(params: URLSearchParams) {
    params.delete(PRODUCT_SORT_PARAM);

    params.delete(PRODUCT_FILTER_PARAMS.SALE);
    params.delete(PRODUCT_FILTER_PARAMS.IN_STOCK);
    params.delete(PRODUCT_FILTER_PARAMS.DISCOUNT);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_FROM);
    params.delete(PRODUCT_FILTER_PARAMS.PRICE_TO);
}
