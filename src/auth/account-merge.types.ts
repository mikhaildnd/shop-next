import type { CartData } from '@/services/cart/cart.types';

export type AccountMergeResult =
    { status: 'success' } | { status: 'unavailable' } | { status: 'failed' };

export type RetryAccountMergeActionResult =
    | {
          status: 'success';
          cart: CartData | null;
          cartError: boolean;
          favoriteIds: string[] | null;
          favoritesError: boolean;
      }
    | {
          status: 'unavailable' | 'failed';
          cart: null;
          cartError: false;
          favoriteIds: null;
          favoritesError: false;
      };
