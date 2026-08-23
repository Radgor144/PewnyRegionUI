import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
    sidebar: ReactNode;
    filters: ReactNode;
    map: ReactNode;
}

export const DashboardLayout = ({ sidebar, filters, map }: DashboardLayoutProps) => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-100 dark:bg-canvas-dark text-slate-900 dark:text-slate-100 font-sans">
            <div className="absolute inset-0 z-0">
                {map}
            </div>

            <div className="absolute top-16 left-0 bottom-0 z-30 flex">
                {sidebar}
            </div>

            {filters}

            <div className="absolute top-0 left-0 right-0 z-50">
                <TopBar />
            </div>
        </div>
    );
};