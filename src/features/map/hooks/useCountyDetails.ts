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
        setLoading(true);
        setError(null);

        Promise.all(
            selectedVariables.map((variable) =>
                fetchCountyDetails(terytCode, variable.bdlIds, abortController.signal)
                    .then((response) => ({
                        apiName: variable.apiName,
                        variables: response.variables || [],
                    }))
            )
        )
            .then((results) => {
                setData(results);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log('Duplicated network request was aborted.');
                    return;
                }
                setError(t('countyDetails.loadError', 'Failed to load details.'));
                setLoading(false);
            });

        return () => {
            abortController.abort();
        };
    }, [terytCode, selectedVariables]);

    return { data, loading, error };
};
