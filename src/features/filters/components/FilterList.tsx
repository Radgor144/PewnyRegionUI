import {useTranslation} from 'react-i18next';
import { BRAND_BLUE } from 'lib/colors';
import { Variable } from 'types/api';

interface FilterListProps {
    variables: Variable[];
    selectedVariables: Variable[];
    onVariableToggle: (updater: (prev: Variable[]) => Variable[]) => void;
    maxSelection: number;
}

export const FilterList = ({variables, selectedVariables, onVariableToggle, maxSelection}: FilterListProps) => {
    const {t, i18n} = useTranslation();
    const safeSelected = Array.isArray(selectedVariables) ? selectedVariables : [];

    return (
        <div className="flex flex-col gap-2 overflow-y-auto pb-3">
            {variables.map(variable => {
                const isSelected = safeSelected.some(v => v.apiName === variable.apiName);
                const isDisabled = !isSelected && safeSelected.length >= maxSelection;
                const hasTranslation = i18n.exists(`variables.${variable.apiName}.label`);
                const label = hasTranslation ? t(`variables.${variable.apiName}.label`) : variable.apiName;
                const description = hasTranslation ? t(`variables.${variable.apiName}.description`) : undefined;
                const containerStyle = isSelected
                    ? {
                        backgroundColor: 'var(--color-selected-bg)',
                        borderColor: 'var(--color-selected-border)',
                        boxShadow: '0 1px 2px rgba(96, 165, 250, 0.12)',
                        cursor: 'pointer',
                    }
                    : isDisabled
                        ? {
                            backgroundColor: 'var(--color-disabled-bg)',
                            borderColor: 'var(--color-disabled-border)',
                            opacity: 0.5,
                            cursor: 'not-allowed',
                        }
                        : {
                            backgroundColor: 'var(--color-panel-alt)',
                            borderColor: 'var(--color-border)',
                            cursor: 'pointer',
                        };

                return (
                    <label
                        key={variable.apiName}
                        title={description}
                        className="flex items-center p-2.5 rounded-lg border transition-all duration-200"
                        style={containerStyle}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDisabled && !isSelected}
                            onChange={() => {
                                if (!isDisabled || isSelected) {
                                    onVariableToggle(prevSelected => {
                                        const currentArray = Array.isArray(prevSelected) ? prevSelected : [];
                                        if (isSelected) return currentArray.filter(v => v.apiName !== variable.apiName);
                                        return currentArray.length < maxSelection ? [...currentArray, variable] : currentArray;
                                    });
                                }
                            }}
                            className="mr-2.5 w-4 h-4 rounded focus:ring-blue-500"
                            style={{
                                accentColor: BRAND_BLUE,
                                borderColor: 'var(--color-border)',
                            }}
                        />
                        <span
                            className="text-[12px] leading-relaxed break-words"
                            style={{
                                fontWeight: isSelected ? 600 : 500,
                                color: isSelected ? 'var(--color-selected-text)' : 'var(--color-text)',
                            }}
                        >
                            {label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};