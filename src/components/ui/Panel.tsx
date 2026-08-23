import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Panel = ({ className, children, ...props }: PanelProps) => {
    const classes = ['bg-white', 'dark:bg-panel-dark', 'rounded-xl', 'shadow-xl', 'border', 'border-slate-200', 'dark:border-slate-700', 'text-slate-700', 'dark:text-slate-300', className].filter(Boolean).join(' ');
    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};


