'use client';

import { Trash2Icon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { useState } from 'react';

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
    onConfirm?: () => void | Promise<void>;
    confirmFormId?: string;
}

export function DeletionDialog({
    trigger,
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Удалить',
    cancelLabel = 'Отмена',
    onConfirm,
    confirmFormId,
}: DeletionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = open ?? internalOpen;

    function handleOpenChange(nextOpen: boolean) {
        setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
    }

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={handleOpenChange}
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

                    <Button
                        size="sm"
                        variant="destructive"
                        type={confirmFormId ? 'submit' : 'button'}
                        form={confirmFormId}
                        onClick={() => {
                            handleOpenChange(false);
                            onConfirm?.();
                        }}
                    >
                        {confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
