import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const IconButton = ({ active, className, children, ...props }: IconButtonProps) => {
    const classes = [
        'inline-flex',
        'items-center',
        'justify-center',
        'p-1.5',
        'h-8',
        'w-8',
        'rounded-md',
        'transition-colors',
        active
            ? 'bg-[var(--color-primary)] text-white'
            : 'bg-[var(--color-panel-alt)] text-[var(--color-text)] hover:bg-[var(--color-hover)]',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            {...props}
        >
            {children}
        </button>
    );
};
