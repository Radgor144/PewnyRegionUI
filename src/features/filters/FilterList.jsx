import React from 'react';

export const FilterList = ({ variables, selectedVariables, onVariableToggle, maxSelection }) => {
    const safeSelected = Array.isArray(selectedVariables) ? selectedVariables : [];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flexGrow: 1, paddingBottom: '16px' }}>
            {variables.map(variable => {
                const isSelected = safeSelected.some(v => v.apiName === variable.apiName);
                const isDisabled = !isSelected && safeSelected.length >= maxSelection;

                return (
                    <label
                        key={variable.apiName}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 14px',
                            backgroundColor: isSelected ? '#eff6ff' : '#f8fafc',
                            border: `1px solid ${isSelected ? '#bfdbfe' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            cursor: isDisabled && !isSelected ? 'not-allowed' : 'pointer',
                            opacity: isDisabled && !isSelected ? 0.6 : 1,
                            transition: 'all 0.2s ease',
                            userSelect: 'none'
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isDisabled && !isSelected}
                            onChange={() => {
                                if (!isDisabled || isSelected) {
                                    onVariableToggle(prevSelected => {
                                        const currentArray = Array.isArray(prevSelected) ? prevSelected : [];

                                        if (isSelected) {
                                            return currentArray.filter(v => v.apiName !== variable.apiName);
                                        } else {
                                            if (currentArray.length < maxSelection) {
                                                return [...currentArray, variable];
                                            }
                                            return currentArray;
                                        }
                                    });
                                }
                            }}
                            style={{
                                marginRight: '12px',
                                width: '16px',
                                height: '16px',
                                accentColor: '#2563eb',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{
                            fontSize: '13px',
                            fontWeight: isSelected ? '600' : '500',
                            color: isSelected ? '#1e40af' : '#334155',
                            wordBreak: 'break-word'
                        }}>
                            {variable.displayName || variable.name || variable.apiName}
                        </span>
                    </label>
                );
            })}
        </div>
    );
};