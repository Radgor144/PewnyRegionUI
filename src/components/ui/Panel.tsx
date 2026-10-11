import React from 'react';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Panel = ({ className, children, ...props }: PanelProps) => {
    const classes = ['rounded-xl', 'shadow-xl', 'border', 'transition-colors', className].filter(Boolean).join(' ');

    return (
        <div
            className={classes}
            style={{
                backgroundColor: 'var(--color-panel)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
            }}
            {...props}
        >
            {children}
        </div>
    );
};
