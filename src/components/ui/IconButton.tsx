import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const IconButton = ({ active, className, children, ...props }: IconButtonProps) => {
    const base = active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700';
    const classes = ['inline-flex', 'items-center', 'justify-center', 'p-1.5', 'h-8', 'w-8', 'rounded-md', 'transition-colors', base, className].filter(Boolean).join(' ');
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};
