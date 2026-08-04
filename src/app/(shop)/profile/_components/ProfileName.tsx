'use client';

import { useState } from 'react';

import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { UpdateUserNameForm } from '@/app/(shop)/profile/_components/UpdateUserNameForm';
import { Button } from '@/components/shared/Button';

interface ProfileNameProps {
    name: string;
}

export function ProfileName({ name }: ProfileNameProps) {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-4">
            <ProfileItem
                label="Имя"
                action={
                    <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Отмена' : 'Редактировать'}
                    </Button>
                }
            >
                <p>{name}</p>
            </ProfileItem>

            {isEditing && (
                <UpdateUserNameForm
                    onSuccess={() => setIsEditing(false)}
                    defaultValue={name}
                />
            )}
        </div>
    );
}
