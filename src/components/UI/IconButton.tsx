import { ReactNode, MouseEventHandler } from 'react';

interface IconButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    children: ReactNode;
    className?: string;
}

export const IconButton = ({ onClick, title, children, className = '' }: IconButtonProps) => (
    <button
        onClick={onClick}
        title={title}
        className={`flex items-center justify-center rounded-xl transition-colors ${className}`}
    >
        {children}
    </button>
);