import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { getCountyName } from '../utils/countySearch';
import type { CountyFeature } from '../types';

interface CountyDetailsPanelProps {
    county: CountyFeature | null;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const CountyDetailsPanel = ({ county, isOpen, setIsOpen }: CountyDetailsPanelProps) => {
    const { t } = useTranslation();
    const countyName = county ? getCountyName(county) : '';

    return (
        <div className="absolute top-16 bottom-0 right-0 z-40 flex pointer-events-none overflow-visible transition-all duration-300">
            <aside className={`h-full bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl transition-[width] duration-300 ease-in-out overflow-hidden pointer-events-auto flex flex-col ${isOpen ? 'w-[320px]' : 'w-0 border-l-0'}`}>
                <div className={`w-[320px] shrink-0 h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex flex-col justify-center px-4 h-16 border-b border-slate-200 dark:border-slate-800/80 shrink-0 overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {t('countyDetails.title')}
                        </span>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                            {countyName}
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-3 scrollbar-hide">
                        <p className="text-center text-slate-400 text-sm py-4">
                            {t('countyDetails.comingSoon')}
                        </p>
                    </div>
                </div>
            </aside>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 z-50 w-7 h-7 rounded-full bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 pointer-events-auto"
                style={{
                    right: isOpen ? '320px' : '14px',
                    transform: 'translate(50%, -50%)'
                }}
                title={isOpen ? t('filters.collapsePanel') : t('filters.expandPanel')}
            >
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    );
};