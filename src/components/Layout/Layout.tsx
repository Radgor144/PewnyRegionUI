import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
        {children}
    </div>
);