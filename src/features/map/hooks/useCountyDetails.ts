import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Variable, VariableDetail } from 'types/api';
import { fetchCountyDetails } from '../api/getCountyDetails';

export interface LabeledVariableGroup {
    apiName: string;
    variables: VariableDetail[];
}

interface UseCountyDetailsResult {
    data: LabeledVariableGroup[] | null;
    loading: boolean;
    error: string | null;
}

export const useCountyDetails = (
    terytCode: string | null,
    selectedVariables: Variable[]
): UseCountyDetailsResult => {
    const { t } = useTranslation();
    const [data, setData] = useState<LabeledVariableGroup[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!terytCode || selectedVariables.length === 0) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const abortController = new AbortController();
        const apiNames = [
            ...new Set(selectedVariables.map((variable) => variable.apiName)),
        ];

        setLoading(true);
        setError(null);

        fetchCountyDetails(terytCode, apiNames, abortController.signal)
            .then((response) => {
                setData(
                    selectedVariables.map((variable) => ({
                        apiName: variable.apiName,
                        variables: response.variables.filter(
                            (detail) => detail.apiName === variable.apiName
                        ),
                    }))
                );

                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    return;
                }

                setError(t('countyDetails.loadError', 'Failed to load details.'));
                setLoading(false);
            });

        return () => {
            abortController.abort();
        };
    }, [terytCode, selectedVariables, t]);

    return { data, loading, error };
};
