import { ThemeSwitcher } from 'components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from 'components/LanguageSwitcher/LanguageSwitcher';

export const TopBar = () => {
    return (
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-[#0b1121] border-b border-slate-200 dark:border-slate-800 z-[60] shrink-0 transition-colors">
            {/* Logo */}
            <div className="flex items-center gap-3 w-64 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                    PR
                </div>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-lg tracking-tight hidden sm:block">
                    Pewny Region
                </h1>
            </div>

            {/* Miejsce na portal wyszukiwarki z mapy */}
            <div id="search-portal-target" className="flex-1 flex justify-center max-w-xl px-4"></div>

            {/* Prawa strona */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 w-auto sm:w-64 shrink-0">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold sm:ml-2">
                    RK
                </div>
            </div>
        </header>
    );
};