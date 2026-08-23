import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export const IconButton = ({ active, className, children, ...props }: IconButtonProps) => {
    const base = active
        ? 'bg-blue-600 text-white'
        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700';
    const classes = ['p-1.5', 'rounded-lg', 'transition-colors', base, className].filter(Boolean).join(' ');
    return (
        <button className={classes} {...props}>
            {children}
        </button>
    );
};



