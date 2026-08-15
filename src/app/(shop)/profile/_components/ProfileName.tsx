'use client';

import { useState } from 'react';

import { ChangeUserNameForm } from '@/app/(shop)/profile/_components/ChangeUserNameForm';
import { ProfileItem } from '@/app/(shop)/profile/_components/ProfileItem';
import { Button } from '@/components/button/Button';

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
                        variant="neutral"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? 'Отмена' : 'Редактировать'}
                    </Button>
                }
            >
                <p>{name}</p>
            </ProfileItem>

            {isEditing && (
                <ChangeUserNameForm onSuccess={() => setIsEditing(false)} />
            )}
        </div>
    );
}
