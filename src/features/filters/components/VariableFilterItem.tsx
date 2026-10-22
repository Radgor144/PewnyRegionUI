import { useTranslation } from 'react-i18next';
import type { Dispatch, SetStateAction } from 'react';
import type { Variable } from 'types/api';

interface VariableFilterItemProps {
    variable: Variable;
    selectedVariables: Variable[];
    onVariableToggle: Dispatch<SetStateAction<Variable[]>>;
    maxSelection: number;
}

export const VariableFilterItem = ({
                                       variable,
                                       selectedVariables,
                                       onVariableToggle,
                                       maxSelection,
                                   }: VariableFilterItemProps) => {
    const { t } = useTranslation();

    const isSelected = selectedVariables.some(
        selected => selected.apiName === variable.apiName,
    );

    const isDisabled =
        !isSelected && selectedVariables.length >= maxSelection;

    const label = t(`variables.${variable.apiName}.label`, {
        defaultValue: variable.apiName,
    });

    const description = t(`variables.${variable.apiName}.description`, {
        defaultValue: '',
    });

    const unit = variable.unit?.trim();

    const unitLabel = unit
        ? t(`units.${unit}`, { defaultValue: unit })
        : '';

    const unitTooltip = unitLabel
        ? t('filters.unitTooltip', { unit: unitLabel })
        : '';

    const tooltip = [description, unitTooltip]
        .filter(Boolean)
        .join('\n');

    const handleChange = () => {
        onVariableToggle(prev =>
            prev.some(s => s.apiName === variable.apiName)
                ? prev.filter(s => s.apiName !== variable.apiName)
                : prev.length < maxSelection ? [...prev, variable] : prev
        );
    };

    return (
        <label
            title={tooltip || undefined}
            className="flex items-center gap-2 rounded-lg border p-2.5 transition-all duration-200"
            style={{
                backgroundColor: isSelected
                    ? 'var(--color-selected-bg)'
                    : 'var(--color-panel-alt)',
                borderColor: isSelected
                    ? 'var(--color-selected-border)'
                    : 'var(--color-border)',
                boxShadow: isSelected
                    ? '0 1px 2px var(--color-menu-accent-shadow)'
                    : 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
            }}
        >
            <input
                type="checkbox"
                checked={isSelected}
                disabled={isDisabled}
                onChange={handleChange}
                className="h-4 w-4 shrink-0 rounded focus:ring-[var(--color-primary)]"
                style={{
                    accentColor: 'var(--color-primary)',
                    borderColor: 'var(--color-border)',
                }}
            />

            <span
                className="min-w-0 flex-1 break-words text-[12px] leading-relaxed"
                style={{
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected
                        ? 'var(--color-selected-text)'
                        : 'var(--color-text)',
                }}
            >
                {label}
            </span>
        </label>
    );
};