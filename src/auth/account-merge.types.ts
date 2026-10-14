import type { CartData } from '@/services/cart/cart.types';

export type AccountMergeResult =
    { status: 'success' } | { status: 'unavailable' } | { status: 'failed' };

export type RetryAccountMergeActionResult =
    | {
          status: 'success';
          cart: CartData;
          cartError: false;
      }
    | {
          status: 'success';
          cart: null;
          cartError: true;
      }
    | {
          status: 'unavailable' | 'failed';
          cart: null;
          cartError: false;
      };
