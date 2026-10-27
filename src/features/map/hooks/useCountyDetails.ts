import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Variable, VariableDetail } from 'types/api';
import { fetchCountyDetails } from '../api/getCountyDetails';

export interface LabeledVariableGroup {
    apiName: string;
    variables: VariableDetail[];
}

export interface CountyDetailsRequest {
    terytCode: string | null;
    selectedVariables: Variable[];
}

interface UseCountyDetailsResult {
    data: LabeledVariableGroup[] | null;
    loading: boolean;
    error: string | null;
}

export const useCountyDetails = (
    request: CountyDetailsRequest | null
): UseCountyDetailsResult => {
    const { t } = useTranslation();
    const [data, setData] = useState<LabeledVariableGroup[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!request?.terytCode || request.selectedVariables.length === 0) {
            setData(null);
            setLoading(false);
            setError(null);
            return;
        }

        const abortController = new AbortController();
        const apiNames = [
            ...new Set(request.selectedVariables.map((variable) => variable.apiName)),
        ];

        setLoading(true);
        setError(null);

        fetchCountyDetails(request.terytCode, apiNames, abortController.signal)
            .then((response) => {
                setData(
                    request.selectedVariables.map((variable) => ({
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
    }, [request, t]);

    return { data, loading, error };
};
