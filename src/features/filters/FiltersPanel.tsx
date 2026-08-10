import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeRangePicker } from './TimeRangePicker';
import { FilterList } from './FilterList';
import { LanguageSwitcher } from 'components/LanguageSwitcher/LanguageSwitcher';
import { ThemeSwitcher } from 'components/ThemeSwitcher/ThemeSwitcher';
import { useVariables } from './hooks/useVariables';
import { useCountyScores } from './hooks/useCountyScores';
import { Variable, CountyScore } from 'api/types';
import { useState } from 'react';

interface FiltersPanelProps {
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    onScoresUpdate: (data: CountyScore[]) => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MAX_SELECTION = 10;

export const FiltersPanel = ({ selectedVariables, onVariableToggle, onScoresUpdate, isOpen, setIsOpen }: FiltersPanelProps) => {
    const { t } = useTranslation();
    const { variables, loading, error: loadError } = useVariables();
    const { generate, isGenerating, error: generateError } = useCountyScores(onScoresUpdate);
    const [yearFrom, setYearFrom] = useState<number>(2012);
    const [yearTo, setYearTo] = useState<number>(2013);

    const handleGenerateMap = () => {
        if (selectedVariables.length === 0) return;
        generate(selectedVariables.map(v => v.apiName), yearFrom, yearTo);
    };

    return (
        <aside className={`absolute top-4 left-4 bottom-4 z-10 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-300 ease-in-out ${isOpen ? 'w-80 md:w-96' : 'w-20'}`}>

            <header className="flex items-center justify-between gap-3 p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30">
                        PR
                    </div>
                    <div className={`transition-opacity duration-200 overflow-hidden ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 hidden'}`}>
                        <h1 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight whitespace-nowrap">{t('app.title')}</h1>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{t('app.subtitle')}</p>
                    </div>
                </div>

                {isOpen && (
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                )}
            </header>

            <div className={`flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide ${!isOpen && 'hidden'}`}>

                <section>
                    <TimeRangePicker yearFrom={yearFrom} setYearFrom={setYearFrom} yearTo={yearTo} setYearTo={setYearTo} />
                </section>

                <hr className="border-slate-100 dark:border-slate-800" />

                <section className="flex-1 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{t('filters.title')}</h2>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-[11px] font-bold rounded-md">
                            {selectedVariables.length} / {MAX_SELECTION}
                        </span>
                    </div>

                    {loading && <p className="text-center text-slate-400 dark:text-slate-500 text-sm py-4">{t('filters.loading')}</p>}
                    {loadError && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-xl text-red-500 dark:text-red-400 text-sm font-medium text-center">
                            {loadError}
                        </div>
                    )}

                    {!loading && !loadError && (
                        <FilterList
                            variables={variables}
                            selectedVariables={selectedVariables}
                            onVariableToggle={onVariableToggle}
                            maxSelection={MAX_SELECTION}
                        />
                    )}
                </section>
            </div>

            {!isOpen && (
                <div className="flex-1 flex flex-col items-center py-6 gap-4">
                    <button onClick={() => setIsOpen(true)} className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors" title="Open filters">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                    </button>
                </div>
            )}

            {isOpen && (
                <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-2xl shrink-0">
                    {generateError && (
                        <p className="text-red-500 dark:text-red-400 text-xs font-medium text-center mb-2">{generateError}</p>
                    )}
                    <button
                        onClick={handleGenerateMap}
                        disabled={isGenerating || selectedVariables.length === 0}
                        className={`w-full py-3 px-4 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                            isGenerating || selectedVariables.length === 0
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50'
                        }`}
                    >
                        {isGenerating ? (
                            t('filters.generating')
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                {t('filters.generateMap')}
                            </>
                        )}
                    </button>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-500 dark:text-slate-300 shadow-md hover:text-blue-600 dark:hover:text-blue-400 transition-colors z-20"
            >
                {isOpen ? '‹' : '›'}
            </button>
        </aside>
    );
};