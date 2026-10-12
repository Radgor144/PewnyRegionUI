import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const IconButton = ({ active, className, children, ...props }: IconButtonProps) => {
    const base = active
        ? {
            backgroundColor: 'var(--color-primary)',
            color: '#ffffff',
        }
        : {
            backgroundColor: 'var(--color-panel-alt)',
            color: 'var(--color-text)',
            hoverBackgroundColor: 'var(--color-hover)',
        };

    const classes = ['inline-flex', 'items-center', 'justify-center', 'p-1.5', 'h-8', 'w-8', 'rounded-md', 'transition-colors', className].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            style={base}
            {...props}
        >
            {children}
        </button>
    );
};
