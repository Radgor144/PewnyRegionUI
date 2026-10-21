import { useMemo, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Variable, VariableCategory } from 'types/api';
import { FILTER_CATEGORY_ORDER } from '../constants/filterCategories';
import { FilterCategory } from './FilterCategory';

interface FilterListProps {
    variables: Variable[];
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    maxSelection: number;
}

export const FilterList = ({
                               variables,
                               selectedVariables,
                               onVariableToggle,
                               maxSelection,
                           }: FilterListProps) => {
    // Jedyne miejsce, gdzie ustalamy co jest domyślnie rozwinięte.
    const [expanded, setExpanded] = useState<
        Partial<Record<VariableCategory, boolean>>
    >({ SAFETY: true });

    const groups = useMemo(() => {
        const byCategory = new Map<VariableCategory, Variable[]>();

        for (const variable of variables) {
            // nieznana kategoria z backendu -> OTHER
            const category = FILTER_CATEGORY_ORDER.includes(variable.category)
                ? variable.category
                : 'OTHER';

            const list = byCategory.get(category);
            if (list) {
                list.push(variable);
            } else {
                byCategory.set(category, [variable]);
            }
        }

        // kolejność wynika z FILTER_CATEGORY_ORDER, puste kategorie pomijamy
        return FILTER_CATEGORY_ORDER
            .filter(category => byCategory.has(category))
            .map(category => ({
                category,
                variables: byCategory.get(category)!,
            }));
    }, [variables]);

    return (
        <div className="flex flex-col gap-3 pb-3">
            {groups.map(({ category, variables: categoryVariables }) => {
                const isExpanded = expanded[category] ?? false;

                return (
                    <FilterCategory
                        key={category}
                        category={category}
                        variables={categoryVariables}
                        selectedVariables={selectedVariables}
                        onVariableToggle={onVariableToggle}
                        maxSelection={maxSelection}
                        isExpanded={isExpanded}
                        onToggleExpanded={() =>
                            setExpanded(prev => ({
                                ...prev,
                                [category]: !isExpanded,
                            }))
                        }
                    />
                );
            })}
        </div>
    );
};