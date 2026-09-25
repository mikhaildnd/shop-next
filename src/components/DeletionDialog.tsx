'use client';

import { Trash2Icon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';

import { Button } from '@/components/button/Button';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface DeletionDialogProps {
    trigger?: ReactElement;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmAction?: ReactElement;
    onConfirm?: () => void | Promise<void>;
}

export function DeletionDialog({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Удалить',
    cancelLabel = 'Отмена',
    confirmAction,
    onConfirm,
}: DeletionDialogProps) {
    return (
        <AlertDialog
            open={open}
            onOpenChange={onOpenChange}
        >
            {trigger && <AlertDialogTrigger render={trigger} />}

            <AlertDialogContent size="sm">
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                    </AlertDialogMedia>

                    <AlertDialogTitle>{title}</AlertDialogTitle>

                    {description && (
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    )}
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel
                        render={
                            <Button
                                size="sm"
                                variant="neutral"
                            >
                                {cancelLabel}
                            </Button>
                        }
                    />

                    {confirmAction ?? (
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
