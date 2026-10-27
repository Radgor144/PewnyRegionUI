import { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeRangePicker } from './TimeRangePicker';
import { FilterList } from './FilterList';
import { useVariables } from '../hooks/useVariables';
import { useGenerateCountyScores } from '../hooks/useGenerateCountyScores';
import type { CountyScore, Variable } from 'types/api';

interface FiltersPanelProps {
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    onMapGenerated: (data: CountyScore[], variables: Variable[]) => void;
    onFiltersReset: () => void;
    hasScores: boolean;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    isMainSidebarOpen: boolean;
}

const MAX_SELECTION = 10;

export const FiltersPanel = ({
                                 selectedVariables,
                                 onVariableToggle,
                                 onMapGenerated,
                                 onFiltersReset,
                                 hasScores,
                                 isOpen,
                                 setIsOpen,
                                 isMainSidebarOpen,
                             }: FiltersPanelProps) => {
    const { t } = useTranslation();
    const [appliedMapSettings, setAppliedMapSettings] = useState<{
        apiNames: string[];
        yearFrom: number;
        yearTo: number;
    } | null>(null);

    const {
        variables,
        loading,
        error: loadError,
    } = useVariables();

    const {
        generate,
        isGenerating,
        error: generateError,
    } = useGenerateCountyScores((data) => {
        onMapGenerated(data, selectedVariables);
        setAppliedMapSettings({
            apiNames: selectedVariables.map(({ apiName }) => apiName).sort(),
            yearFrom,
            yearTo,
        });
    });

    const [yearFrom, setYearFrom] = useState<number>(2016);
    const [yearTo, setYearTo] = useState<number>(2023);

    const handleGenerateMap = () => {
        if (selectedVariables.length === 0) {
            return;
        }

        generate(
            selectedVariables.map(variable => variable.apiName),
            yearFrom,
            yearTo,
        );
    };

    const handleResetFilters = () => {
        onVariableToggle([]);
        onFiltersReset();
        setAppliedMapSettings(null);
    };

    const isResetDisabled =
        isGenerating || (selectedVariables.length === 0 && !hasScores);

    const isGenerateDisabled =
        isGenerating || selectedVariables.length === 0;
    const isMapOutOfDate = hasScores && appliedMapSettings !== null && (
        JSON.stringify(selectedVariables.map(({ apiName }) => apiName).sort()) !==
            JSON.stringify(appliedMapSettings.apiNames) ||
        yearFrom !== appliedMapSettings.yearFrom ||
        yearTo !== appliedMapSettings.yearTo
    );

    return (
        <div
            className={`absolute top-14 bottom-0 z-40 flex pointer-events-none overflow-visible transition-all duration-300 ${
                isMainSidebarOpen ? 'left-40' : 'left-[44px]'
            }`}
        >
            <aside
                className={`h-full shadow-2xl transition-[width] duration-300 ease-in-out overflow-hidden pointer-events-auto flex flex-col ${
                    isOpen ? 'w-[280px]' : 'w-0 border-r-0'
                }`}
                style={{
                    backgroundColor: 'var(--color-panel)',
                    borderRight: isOpen
                        ? '1px solid var(--color-border)'
                        : 'none',
                }}
            >
                <div
                    className={`w-[280px] shrink-0 h-full flex flex-col transition-opacity duration-200 ${
                        isOpen
                            ? 'opacity-100'
                            : 'opacity-0 pointer-events-none'
                    }`}
                >
                    <div
                        className="relative z-20 flex h-14 shrink-0 items-center px-3"
                        style={{
                            borderBottom: '1px solid var(--color-border)',
                        }}
                    >
                        <div
                            id="county-search-panel-target"
                            className="w-full"
                        />
                    </div>

                    <div
                        className="flex h-14 shrink-0 items-center justify-between gap-2 px-3"
                        style={{
                            borderBottom: '1px solid var(--color-border)',
                        }}
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <h2
                                className="whitespace-nowrap text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: 'var(--color-text)' }}
                            >
                                {t('filters.title')}
                            </h2>

                            <span
                                className="rounded-md border px-1.5 py-0.5 text-[9px] font-bold"
                                style={{
                                    backgroundColor:
                                        'var(--color-panel-alt)',
                                    color: 'var(--color-text-muted)',
                                    borderColor: 'var(--color-border)',
                                }}
                            >
                                {selectedVariables.length}/{MAX_SELECTION}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={handleResetFilters}
                            disabled={isResetDisabled}
                            title={t('filters.clearSelections')}
                            aria-label={t('filters.clearSelections')}
                            className="flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium transition-colors"
                            style={{
                                color: isResetDisabled
                                    ? 'var(--color-text-muted)'
                                    : 'var(--color-primary)',
                                cursor: isResetDisabled ? 'not-allowed' : 'pointer',
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                            >
                                <path d="M3 6h18" />
                                <path d="m8 6 .7-2h6.6l.7 2" />
                                <path d="m19 6-1 14H6L5 6" />
                                <path d="M10 10v6M14 10v6" />
                            </svg>

                            <span>{t('filters.clearSelections')}</span>
                        </button>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="scrollbar-hide flex-1 overflow-y-auto px-3 py-2">
                            {loading && (
                                <p
                                    className="py-4 text-center text-xs"
                                    style={{
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    {t('filters.loading')}
                                </p>
                            )}

                            {loadError && (
                                <div
                                    className="text-center text-xs"
                                    style={{ color: '#ef4444' }}
                                >
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
                        </div>
                    </div>

                    <div
                        className="shrink-0 p-3"
                        style={{
                            borderTop: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-panel)',
                        }}
                    >
                        <div className="mb-3">
                            <TimeRangePicker
                                yearFrom={yearFrom}
                                setYearFrom={setYearFrom}
                                yearTo={yearTo}
                                setYearTo={setYearTo}
                            />
                        </div>

                        {generateError && (
                            <p
                                className="mb-2 text-center text-[11px] font-medium"
                                style={{ color: '#ef4444' }}
                            >
                                {generateError}
                            </p>
                        )}

                        {isMapOutOfDate && (
                            <p
                                role="status"
                                className="mb-2 text-center text-[11px]"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {t('filters.mapNeedsUpdate')}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleGenerateMap}
                            disabled={isGenerateDisabled}
                            className="min-h-[40px] w-full rounded-xl px-3 py-2 text-[12px] font-semibold shadow-md transition-all"
                            style={{
                                backgroundColor: isGenerateDisabled
                                    ? 'var(--color-generate-map-disabled-bg)'
                                    : 'var(--color-generate-map-bg)',
                                color: isGenerateDisabled
                                    ? 'var(--color-generate-map-disabled-text)'
                                    : 'var(--color-generate-map-text)',
                                boxShadow: isGenerateDisabled
                                    ? 'none'
                                    : '0 10px 15px -3px var(--color-menu-accent-shadow)',
                                cursor: isGenerateDisabled
                                    ? 'not-allowed'
                                    : 'pointer',
                            }}
                        >
                            {isGenerating
                                ? t('filters.generating')
                                : t('filters.generateMap')}
                        </button>
                    </div>
                </div>
            </aside>

            <button
                type="button"
                onClick={() => setIsOpen(previous => !previous)}
                className="absolute top-1/2 z-50 flex h-9 w-9 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-105 pointer-events-auto"
                style={{
                    left: isOpen ? '280px' : '0px',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--color-panel)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text-muted)',
                }}
                title={
                    isOpen
                        ? t('filters.collapsePanel')
                        : t('filters.expandPanel')
                }
                aria-label={
                    isOpen
                        ? t('filters.collapsePanel')
                        : t('filters.expandPanel')
                }
            >
                <svg
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${
                        !isOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
        </div>
    );
};