import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchVariables } from 'features/filters/api/getVariables';
import { Variable } from 'types/api';

interface UseVariablesResult {
    variables: Variable[];
    loading: boolean;
    error: string | null;
}

export const useVariables = (): UseVariablesResult => {
    const { t } = useTranslation();
    const [variables, setVariables] = useState<Variable[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchVariables()
            .then(data => {
                if (!cancelled) { setVariables(data); setLoading(false); }
            })
            .catch(() => {
                if (!cancelled) { setError(t('filters.loadError')); setLoading(false); }
            });
        return () => { cancelled = true; };
    }, [t]);

    return { variables, loading, error };
};