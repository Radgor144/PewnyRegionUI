import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeRangePicker } from './TimeRangePicker';
import { FilterList } from './FilterList';
import { useVariables } from '../hooks/useVariables';
import { useGenerateCountyScores } from '../hooks/useGenerateCountyScores';
import { CountyScore, Variable } from 'types/api';

interface FiltersPanelProps {
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    onScoresUpdate: (data: CountyScore[]) => void;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isMainSidebarOpen: boolean;
}

const MAX_SELECTION = 10;

export const FiltersPanel = ({
                                 selectedVariables,
                                 onVariableToggle,
                                 onScoresUpdate,
                                 isOpen,
                                 setIsOpen,
                                 isMainSidebarOpen,
                             }: FiltersPanelProps) => {
    const { t } = useTranslation();
    const { variables, loading, error: loadError } = useVariables();
    const { generate, isGenerating, error: generateError } = useGenerateCountyScores(onScoresUpdate);
    const [yearFrom, setYearFrom] = useState<number>(2016);
    const [yearTo, setYearTo] = useState<number>(2023);

    const handleGenerateMap = () => {
        if (selectedVariables.length === 0) return;
        generate(selectedVariables.map(v => v.apiName), yearFrom, yearTo);
    };

    return (
        <div
            className={`absolute top-14 bottom-0 z-40 flex pointer-events-none overflow-visible transition-all duration-300 ${
                isMainSidebarOpen ? 'left-40' : 'left-[44px]'
            }`}
        >
            <aside className={`h-full bg-white dark:bg-surface-dark border-r border-slate-200 dark:border-slate-800/80 shadow-2xl transition-[width] duration-300 ease-in-out overflow-hidden pointer-events-auto flex flex-col ${isOpen ? 'w-[280px]' : 'w-0 border-r-0'}`}>
                <div className={`w-[280px] shrink-0 h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="border-b border-slate-200 dark:border-slate-800/80 px-3 py-2.5">
                        <div id="county-search-panel-target" className="w-full" />
                    </div>

                    <div className="flex items-center justify-between px-3 h-11 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
                        <div className="flex items-center gap-2">
                            <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                {t('filters.title')}
                            </h2>
                            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-bold rounded-md border border-slate-200/50 dark:border-slate-700/50">
                                {selectedVariables.length}/{MAX_SELECTION}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
                            {loading && <p className="text-center text-slate-400 text-xs py-4">{t('filters.loading')}</p>}
                            {loadError && <div className="text-red-500 text-xs text-center">{loadError}</div>}
                            {!loading && !loadError && (
                                <FilterList
                                    variables={variables}
                                    selectedVariables={selectedVariables}
                                    onVariableToggle={onVariableToggle}
                                    maxSelection={MAX_SELECTION}
                                />
                            )}
                        </div>
                    </div>

                    <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-surface-dark shrink-0">
                        <div className="mb-3">
                            <TimeRangePicker yearFrom={yearFrom} setYearFrom={setYearFrom} yearTo={yearTo} setYearTo={setYearTo} />
                        </div>

                        {generateError && <p className="text-red-500 dark:text-red-400 text-[11px] font-medium text-center mb-2">{generateError}</p>}

                        <button
                            onClick={handleGenerateMap}
                            disabled={isGenerating || selectedVariables.length === 0}
                            className={`w-full min-h-[40px] py-2 px-3 rounded-xl text-[12px] font-semibold transition-all shadow-md ${
                                isGenerating || selectedVariables.length === 0
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 hover:shadow-blue-600/40'
                            }`}
                        >
                            {isGenerating ? t('filters.generating') : t('filters.generateMap')}
                        </button>
                    </div>
                </div>
            </aside>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 z-50 w-9 h-9 rounded-full bg-white dark:bg-panel-dark border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 pointer-events-auto"
                style={{
                    left: isOpen ? '280px' : '0px',
                    transform: 'translate(-50%, -50%)'
                }}
                title={isOpen ? t('filters.collapsePanel') : t('filters.expandPanel')}
            >
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>
    );
};