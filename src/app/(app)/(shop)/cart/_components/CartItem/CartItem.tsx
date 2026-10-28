import { ImageOff, Info } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import styles from '@/app/(app)/(shop)/cart/_components/CartItem/CartItem.module.css';
import { CartItemRemoveButton } from '@/app/(app)/(shop)/cart/_components/CartItemRemoveButton';
import { useCartContext } from '@/components/cart/CartContext';
import { CartItemQuantity } from '@/components/cart/CartItemQuantity';
import { DeletionDialog } from '@/components/DeletionDialog';
import { FavoriteButton } from '@/components/favorite/FavoriteButton';
import { Checkbox } from '@/components/form/Checkbox';
import { toast } from '@/components/ui/toast';
import type { CartItemData } from '@/lib/cart/cart.types';
import { cn } from '@/lib/cn';
import { formatMeasureValue } from '@/lib/format-measure-value';
import { formatPrice } from '@/lib/format-price';
import { routes } from '@/routes';

interface CartItemProps {
    item: CartItemData;
}

export function CartItem({ item }: CartItemProps) {
    const { removeCartItem, setCartItemSelection } = useCartContext();
    const isSelected = item.isSelected;

    const wasQuantityAdjusted = item.quantityAdjustedFrom !== null;

    const measure = formatMeasureValue(
        item.product.measureValue,
        item.product.measureType,
    );

    const lineRegular = formatPrice(item.quantity * item.product.regularPrice);

    const lineTotal = formatPrice(item.quantity * item.product.effectivePrice);

    const isOutOfStock = item.product.stock === 0;

    const handleSelectionChange = async (isSelected: boolean) => {
        try {
            await setCartItemSelection(item.productId, isSelected);
        } catch {
            toast.add({
                id: 'cart-selection-error',
                type: 'error',
                description:
                    'Не удалось изменить выбор товара. Попробуйте ещё раз.',
            });
        }
    };

    const handleRemove = async () => {
        try {
            await removeCartItem(item.productId);
        } catch {
            toast.add({
                id: 'cart-remove-error',
                type: 'error',
                description: 'Не удалось удалить товар. Попробуйте ещё раз.',
            });
        }
    };

    return (
        <article className={cn('py-3', styles.item)}>
            <div className={cn('relative', styles.image)}>
                <Link href={routes.productPage(item.product.slug)}>
                    <CartItemImage
                        imageUrl={item.product.imageUrl}
                        imageAlt={item.product.title}
                        imageDisabled={isOutOfStock}
                    />
                </Link>

                {!isOutOfStock && (
                    <Checkbox
                        id={`cart-item-${item.productId}`}
                        checked={isSelected}
                        onChange={handleSelectionChange}
                        ariaLabel={`Выбрать ${item.product.title}`}
                        variant="cart"
                        className="absolute top-0 left-0 z-2"
                    />
                )}
            </div>

            <div className={styles.price}>
                {!isOutOfStock && (
                    <CartItemPrice
                        lineTotal={lineTotal}
                        lineRegular={lineRegular}
                        discountPercent={item.product.discountPercent}
                    />
                )}
            </div>

            <div className={styles.details}>
                <CartItemDetails
                    description={item.product.title}
                    linkUrl={routes.productPage(item.product.slug)}
                    isOutOfStock={isOutOfStock}
                    price={item.product.effectivePrice}
                    measure={measure}
                />
            </div>

            {wasQuantityAdjusted && !isOutOfStock && (
                <div className={cn('md:mt-3', styles.info)}>
                    <p className="flex max-w-120 items-center gap-3 rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-500">
                        <Info className="size-5 shrink-0" />
                        <span>
                            Количество товара было уменьшено из-за недостатка на
                            складе.
                        </span>
                    </p>
                </div>
            )}

            <div
                className={cn(
                    'flex gap-2 md:flex-col md:items-end',
                    styles.controls,
                )}
            >
                {!isOutOfStock && (
                    <CartItemQuantity
                        className={cn('order-last md:order-first')}
                        productId={item.productId}
                        quantity={item.displayQuantity}
                        maxQuantity={item.product.stock}
                        size="sm"
                        variant="neutral"
                        confirmRemoval
                    />
                )}

                <div className="flex gap-2 md:mt-auto">
                    <FavoriteButton
                        productId={item.productId}
                        className="bg-gray-50"
                        size="sm"
                        shape="rounded"
                    />

                    <DeletionDialog
                        trigger={
                            <CartItemRemoveButton
                                className="bg-gray-50"
                                size="sm"
                                shape="rounded"
                            />
                        }
                        title="Удалить товар?"
                        description="Товар будет удалён из корзины."
                        onConfirm={handleRemove}
                    />
                </div>
            </div>
        </article>
    );
}

interface CartItemImageProps {
    imageUrl?: string | null;
    imageAlt?: string;
    imageDisabled: boolean;
    className?: string;
}

function CartItemImage({
    imageUrl,
    imageAlt,
    imageDisabled,
    className,
}: CartItemImageProps) {
    return (
        <div
            className={cn(
                'relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-50',
                className,
            )}
        >
            {imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={imageAlt ?? ''}
                    fill
                    className={cn(
                        'object-cover',
                        imageDisabled && 'opacity-60 grayscale',
                    )}
                    sizes="96px"
                />
            ) : (
                <ImageOff
                    aria-hidden="true"
                    className="size-10 text-gray-300"
                />
            )}
        </div>
    );
}

interface CartItemPriceProps {
    lineTotal: string;
    lineRegular: string;
    discountPercent: number;
    className?: string;
}

function CartItemPrice({
    lineTotal,
    lineRegular,
    discountPercent,
    className,
}: CartItemPriceProps) {
    const hasDiscount = discountPercent > 0;

    return (
        <div className={cn('flex flex-col gap-y-0.5', className)}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <p className="text-base leading-none font-bold break-all text-[#414141]">
                    {lineTotal} ₸
                </p>

                {hasDiscount && (
                    <div className="rounded-lg bg-[#ff6633] px-2 py-0.5 text-xs text-white">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            {hasDiscount && (
                <p className="text-xs text-[#bfbfbf] line-through">
                    {lineRegular} ₸
                </p>
            )}
        </div>
    );
}

interface CartItemDetailsProps {
    description: string;
    linkUrl: string;
    isOutOfStock: boolean;
    price: number;
    measure: string;
    className?: string;
}

function CartItemDetails({
    description,
    linkUrl,
    isOutOfStock,
    price,
    measure,
    className,
}: CartItemDetailsProps) {
    return (
        <div className={cn('flex flex-col gap-y-0.5', className)}>
            <Link
                href={linkUrl}
                className={cn(
                    'line-clamp-3 text-sm leading-tight text-[#414141] hover:text-(--color-primary) hover:underline md:text-base',
                    isOutOfStock && 'text-gray-500',
                )}
            >
                {description}
            </Link>

            {!isOutOfStock ? (
                <div className="flex flex-wrap gap-1 text-xs leading-none text-gray-500">
                    <span>1 товар • {measure},</span>
                    <span>{formatPrice(price)} ₸/ед.</span>
                </div>
            ) : (
                <p className="text-sm text-amber-600">Товар закончился</p>
            )}
        </div>
    );
}
