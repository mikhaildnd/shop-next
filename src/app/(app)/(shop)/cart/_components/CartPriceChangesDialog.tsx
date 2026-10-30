import { CartPriceChangeItem } from '@/app/(app)/(shop)/cart/_components/CartPriceChangeItem';
import { Button } from '@/components/button/Button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import type { CartItemData } from '@/lib/cart/cart.types';

interface CartPriceChangesDialogProps {
    cartItems: CartItemData[];
}

export function CartPriceChangesDialog({
    cartItems,
}: CartPriceChangesDialogProps) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button
                        size="sm"
                        variant="neutral"
                    >
                        Подробнее
                    </Button>
                }
            />
            <DialogContent className="p-3 md:p-4">
                <DialogHeader className="gap-0.5">
                    <DialogTitle className="md:text-base">
                        Цены изменились
                    </DialogTitle>
                    <DialogDescription>
                        Проверьте цены перед покупкой.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                    <div className="flex flex-col divide-y divide-gray-200">
                        {cartItems.map((item) => {
                            return (
                                <CartPriceChangeItem
                                    key={item.productId}
                                    item={item}
                                />
                            );
                        })}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
