import { cn } from '@/utils/cn';

interface SliderPaginationBulletProps {
    isActive: boolean;
    onClick: () => void;
}

const SliderPaginationBullet = ({
    isActive,
    onClick,
}: SliderPaginationBulletProps) => {
    return (
        <button
            className={cn(
                'h-2 w-2 cursor-pointer rounded-full transition-[width]',
                isActive ? 'w-3.5 bg-(--color-primary)' : 'bg-gray-300',
            )}
            onClick={onClick}
        />
    );
};

export default SliderPaginationBullet;
