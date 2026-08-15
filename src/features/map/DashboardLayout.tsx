import { ReactNode } from 'react';
import { ThemeSwitcher } from 'components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from 'components/LanguageSwitcher/LanguageSwitcher';

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

            {/* Górny pasek (header) */}
            <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 z-50">
                <div className="flex items-center gap-3 w-72">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                        PR
                    </div>
                    <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight">
                        Pewny Region
                    </h1>
                </div>

                <div className="flex-1 flex justify-center max-w-md mx-auto">
                    <div id="search-portal-target" className="w-full"></div>
                </div>

                <div className="flex items-center justify-end gap-4 w-72">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold ml-2">
                        RK
                    </div>
                </div>
            </header>
        </div>
    );
};