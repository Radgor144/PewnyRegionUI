import { ReactNode } from 'react';
import { TopBar } from './TopBar';

interface DashboardLayoutProps {
    sidebar: ReactNode;
    filters: ReactNode;
    map: ReactNode;
}

export const DashboardLayout = ({ sidebar, filters, map }: DashboardLayoutProps) => {
    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-100 dark:bg-[#0b1121] text-slate-900 dark:text-slate-100 font-sans">
            {/* Mapa stabilnie w tle na pełnym ekranie */}
            <div className="absolute inset-0 z-0">
                {map}
            </div>

            {/* Lewe menu główne (hamburger) */}
            <div className="absolute top-16 left-0 bottom-0 z-30 flex">
                {sidebar}
            </div>

            {/* Pływający panel filtrów */}
            {filters}

            {/* Górny pasek (header) używający gotowego komponentu */}
            <div className="absolute top-0 left-0 right-0 z-50">
                <TopBar />
            </div>
        </div>
    );
};