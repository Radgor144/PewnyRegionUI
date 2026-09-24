import { ThemeSwitcher } from 'components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from 'components/LanguageSwitcher/LanguageSwitcher';

export const TopBar = () => {
    return (
        <header className="h-14 flex items-center justify-between px-3 sm:px-4 bg-white dark:bg-canvas-dark border-b border-slate-200 dark:border-slate-800 z-[60] shrink-0 transition-colors">
            <div className="flex items-center gap-2.5 w-56 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[11px] shadow-md shadow-blue-500/20">
                    PR
                </div>
                <h1 className="font-bold text-slate-800 dark:text-slate-100 text-base tracking-tight hidden sm:block">
                    Pewny Region
                </h1>
            </div>

            <div id="search-portal-target" className="flex-1 flex justify-center max-w-xl px-3"></div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-3 w-auto sm:w-56 shrink-0">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-[10px] font-bold sm:ml-1.5">
                    RK
                </div>
            </div>
        </header>
    );
};