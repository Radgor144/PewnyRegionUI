import { ThemeSwitcher } from 'components/ThemeSwitcher/ThemeSwitcher';
import { LanguageSwitcher } from 'components/LanguageSwitcher/LanguageSwitcher';
import { BRAND_BLUE, BRAND_BLUE_SHADOW } from 'lib/colors';

export const TopBar = () => {
    return (
        <header
            className="h-14 flex items-center justify-between px-3 sm:px-4 z-[60] shrink-0 transition-colors"
            style={{
                backgroundColor: 'var(--color-panel)',
                borderBottom: '1px solid var(--color-border)',
            }}
        >
            <div className="flex items-center gap-2.5 w-56 shrink-0">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shadow-md" style={{ backgroundColor: BRAND_BLUE, boxShadow: `0 10px 15px -3px ${BRAND_BLUE_SHADOW}` }}>
                    PR
                </div>
                <h1 className="font-bold text-base tracking-tight hidden sm:block" style={{ color: 'var(--color-text)' }}>
                    Pewny Region
                </h1>
            </div>

            <div id="search-portal-target" className="flex-1 flex justify-center max-w-xl px-3"></div>

            <div className="flex items-center justify-end gap-1.5 sm:gap-3 w-auto sm:w-56 shrink-0">
                <ThemeSwitcher />
                <LanguageSwitcher />
                <div className="w-7 h-7 rounded-full text-white flex items-center justify-center text-[10px] font-bold sm:ml-1.5" style={{ backgroundColor: BRAND_BLUE }}>
                    RK
                </div>
            </div>
        </header>
    );
};