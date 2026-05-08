import clsx from 'clsx';

interface PaginationBulletProps {
    isActive: boolean;
    onClick: () => void;
}

const PaginationBullet = ({ isActive, onClick }: PaginationBulletProps) => {
    return (
        <button
            className={clsx(
                'h-2 w-2 cursor-pointer rounded-full transition-[width]',
                isActive ? 'w-3.5 bg-(--color-primary)' : 'bg-gray-300',
            )}
            onClick={onClick}
        />
    );
};

export default PaginationBullet;
