import React from 'react';
import { useTranslation } from 'react-i18next';

export const FilterList = ({ variables, selectedVariables, onVariableToggle, maxSelection }) => {
    const { t, i18n } = useTranslation();
    const safeSelected = Array.isArray(selectedVariables) ? selectedVariables : [];

    return (
        <div className="flex flex-col gap-2.5 overflow-y-auto pb-4">
            {variables.map(variable => {
                const isSelected = safeSelected.some(v => v.apiName === variable.apiName);
                const isDisabled = !isSelected && safeSelected.length >= maxSelection;
                const hasTranslation = i18n.exists(`variables.${variable.apiName}.label`);
                const label = hasTranslation ? t(`variables.${variable.apiName}.label`) : variable.apiName;
                const description = hasTranslation ? t(`variables.${variable.apiName}.description`) : null;

                return (
                    <label
                        key={variable.apiName}
                        title={description || undefined}
                        className={`flex items-center p-3.5 rounded-xl border transition-all duration-200 ${
                            isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-950/70 border-blue-500 dark:border-blue-600 shadow-sm shadow-blue-500/10 cursor-pointer'
                                : isDisabled
                                    ? 'bg-slate-100/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-50 cursor-not-allowed'
                                    : 'bg-slate-50/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/60 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm cursor-pointer'
                        }`}
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
                            className={`mr-3 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 ${
                                isDisabled && !isSelected ? 'cursor-not-allowed' : 'cursor-pointer'
                            }`}
                            style={{ accentColor: '#2563eb' }}
                        />
                        <span className={`text-xs leading-relaxed break-words ${
                            isSelected
                                ? 'font-semibold text-blue-950 dark:text-blue-200'
                                : 'font-medium text-slate-700 dark:text-slate-300'
                        }`}>
                            {label}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};