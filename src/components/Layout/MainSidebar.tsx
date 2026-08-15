import { useTranslation } from 'react-i18next';

interface MainSidebarProps {
    isOpen: boolean;
    toggleOpen: () => void;
}

export const MainSidebar = ({ isOpen, toggleOpen }: MainSidebarProps) => {
    const { t } = useTranslation();

    return (
        <aside className={`relative flex flex-col h-full bg-white dark:bg-[#0b1121] border-r border-slate-200 dark:border-slate-800/85 shrink-0 z-30 transition-[width] duration-300 ease-in-out ${isOpen ? 'w-56' : 'w-[72px]'}`}>
            <div className="flex items-center h-16 border-b border-slate-200 dark:border-slate-800/80 shrink-0 px-3">
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                    <button
                        onClick={toggleOpen}
                        className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                        title="Menu"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <nav className="p-3 space-y-2 flex-1 overflow-hidden">
                <button className="w-full flex items-center h-11 rounded-xl bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-blue-500/20 overflow-hidden" title={t('sidebar.map')}>
                    <div className="w-12 h-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    </div>
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.map')}</span>
                </button>

                <button className="w-full flex items-center h-11 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium text-sm transition-all overflow-hidden" title={t('sidebar.counties')}>
                    <div className="w-12 h-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    </div>
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.counties')}</span>
                </button>

                <button className="w-full flex items-center h-11 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 font-medium text-sm transition-all overflow-hidden" title={t('sidebar.rankings')}>
                    <div className="w-12 h-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <span className={`whitespace-nowrap transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{t('sidebar.rankings')}</span>
                </button>
            </nav>
        </aside>
    );
};