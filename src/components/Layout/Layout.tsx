import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-100 dark:bg-[#0b1121] text-slate-900 dark:text-slate-100 font-sans">
        <TopBar />
        <div className="flex flex-1 overflow-hidden relative">
            {children}
        </div>
    </div>
);