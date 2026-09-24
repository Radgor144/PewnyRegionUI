import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { getCountyName } from '../utils/countySearch';
import { getTeryt } from '../utils/teryt';
import { useCountyDetails } from '../hooks/useCountyDetails';
import { ChartCard } from './ChartCard';
import type { CountyFeature } from '../types';
import type { Variable, VariableDetail } from 'types/api';

const PanelContent = ({ county, selectedVariables, loading, error, detailsData, t }: any) => {
    const fallbacks = [
        { isActive: !county, message: t('countyDetails.selectCounty', 'Select a county on the map to view details.') },
        { isActive: selectedVariables.length === 0, message: t('countyDetails.noVariablesSelected', 'Select variables in filters to view charts.') },
        { isActive: loading, message: t('countyDetails.loading', 'Loading data...') },
        { isActive: !!error, message: error, isError: true }
    ];

    const activeFallback = fallbacks.find(fallback => fallback.isActive);

    if (activeFallback) {
        const textColor = activeFallback.isError ? 'text-red-500' : 'text-slate-400';
        return <p className={`text-center text-sm py-4 ${textColor}`}>{activeFallback.message}</p>;
    }

    if (!detailsData || detailsData.length === 0) return null;

    return (
        <div className="space-y-4">
            {detailsData.map(({ apiName, variables }: { apiName: string, variables: VariableDetail[] }) =>
                variables.map((variableDetail) => (
                    <ChartCard
                        key={`${apiName}-${variableDetail.bdlVariableId}`}
                        variable={variableDetail}
                        title={t(`variables.${apiName}.label`)}
                    />
                ))
            )}
        </div>
    );
};

interface CountyDetailsPanelProps {
    county: CountyFeature | null;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    selectedVariables: Variable[];
}

export const CountyDetailsPanel = ({ county, isOpen, setIsOpen, selectedVariables }: CountyDetailsPanelProps) => {
    const { t } = useTranslation();
    const countyName = county ? getCountyName(county) : '';
    const terytCode = county?.properties ? getTeryt(county.properties) ?? null : null;

    const { data: detailsData, loading, error } = useCountyDetails(terytCode, selectedVariables);

    return (
        <div className="absolute top-16 bottom-0 right-0 z-40 flex pointer-events-none overflow-visible transition-all duration-300">
            <aside className={`h-full bg-white dark:bg-[#111827] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl transition-[width] duration-300 ease-in-out overflow-hidden pointer-events-auto flex flex-col ${isOpen ? 'w-[500px]' : 'w-0 border-l-0'}`}>
                <div className={`w-[500px] shrink-0 h-full flex flex-col transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex flex-col justify-center px-4 h-16 border-b border-slate-200 dark:border-slate-800/80 shrink-0 overflow-hidden">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            {t('countyDetails.title')}
                        </span>
                        <h2 className="text-m font-bold text-slate-800 dark:text-slate-100 truncate">
                            {countyName || t('countyDetails.selectCountyTitle', 'No county selected')}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
                        <PanelContent
                            county={county}
                            selectedVariables={selectedVariables}
                            loading={loading}
                            error={error}
                            detailsData={detailsData}
                            t={t}
                        />
                    </div>
                </div>
            </aside>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute top-1/2 z-50 w-7 h-7 rounded-full bg-white dark:bg-[#1f2937] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out hover:scale-105 pointer-events-auto"
                style={{
                    right: isOpen ? '500px' : '14px',
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
