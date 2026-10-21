import { useTranslation } from 'react-i18next';
import type { Dispatch, SetStateAction } from 'react';
import type { Variable, VariableCategory } from 'types/api';
import { CategoryIcon } from './CategoryIcon';
import { VariableFilterItem } from './VariableFilterItem';

interface FilterCategoryProps {
    category: VariableCategory;
    variables: Variable[];
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    maxSelection: number;
    isExpanded: boolean;
    onToggleExpanded: () => void;
}

export const FilterCategory = ({
                                   category,
                                   variables,
                                   selectedVariables,
                                   onVariableToggle,
                                   maxSelection,
                                   isExpanded,
                                   onToggleExpanded,
                               }: FilterCategoryProps) => {
    const { t } = useTranslation();

    const selectedCount = variables.filter(variable =>
        selectedVariables.some(
            selected => selected.apiName === variable.apiName,
        ),
    ).length;

    const categoryLabel = t(`filters.categories.${category}`, {
        defaultValue: category,
    });

    const sectionId = `filter-category-${category.toLowerCase()}`;

    return (
        <section className="flex flex-col">
            <button
                type="button"
                aria-expanded={isExpanded}
                aria-controls={sectionId}
                onClick={onToggleExpanded}
                className="flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2.5 text-left transition-colors"
                style={{
                    backgroundColor: 'var(--color-panel-alt)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                }}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <span style={{ color: 'var(--color-text-muted)' }}>
                        <CategoryIcon category={category} />
                    </span>

                    <span className="truncate text-xs font-semibold">
                        {categoryLabel}
                    </span>
                </span>

                <span className="flex shrink-0 items-center gap-2">
                    <span
                        className="rounded-md border px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                            backgroundColor:
                                selectedCount > 0
                                    ? 'var(--color-selected-bg)'
                                    : 'var(--color-panel)',
                            borderColor:
                                selectedCount > 0
                                    ? 'var(--color-selected-border)'
                                    : 'var(--color-border)',
                            color:
                                selectedCount > 0
                                    ? 'var(--color-selected-text)'
                                    : 'var(--color-text-muted)',
                        }}
                        aria-label={t('filters.categorySelectionCount', {
                            selected: selectedCount,
                            total: variables.length,
                        })}
                    >
                        {selectedCount}/{variables.length}
                    </span>

                    <svg
                        className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
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
                            d="m9 18 6-6-6-6"
                        />
                    </svg>
                </span>
            </button>

            <div
                id={sectionId}
                role="region"
                aria-label={categoryLabel}
                className={isExpanded ? 'flex flex-col gap-2 pt-2' : 'hidden'}
            >
                {variables.map(variable => (
                    <VariableFilterItem
                        key={variable.apiName}
                        variable={variable}
                        selectedVariables={selectedVariables}
                        onVariableToggle={onVariableToggle}
                        maxSelection={maxSelection}
                    />
                ))}
            </div>
        </section>
    );
};