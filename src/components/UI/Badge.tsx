import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary';

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    primary: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
};

export const Badge = ({ children, variant = 'default' }: BadgeProps) => (
    <span className={`px-2 py-1 text-[11px] font-bold rounded-md ${VARIANT_CLASSES[variant]}`}>
        {children}
    </span>
);