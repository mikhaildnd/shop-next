'use client';

import { useState } from 'react';

import { ChangeUserPasswordForm } from '@/app/(shop)/profile/_components/ChangeUserPasswordForm';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { Button } from '@/components/shared/button/Button';

export function ProfilePassword() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-4">
            <ProfileItem
                label="Пароль"
                action={
                    <Button
                        variant="neutral"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Отмена' : 'Изменить'}
                    </Button>
                }
            />

            {isEditing && (
                <ChangeUserPasswordForm onSuccess={() => setIsEditing(false)} />
            )}
        </div>
    );
}
