import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchCountyScores } from 'api/variables';
import { CountyScore } from 'api/types';

interface UseCountyScoresResult {
    generate: (apiNames: string[], yearFrom: number, yearTo: number) => Promise<void>;
    isGenerating: boolean;
    error: string | null;
}

export const useCountyScores = (
    onScoresUpdate: (data: CountyScore[]) => void
): UseCountyScoresResult => {
    const { t } = useTranslation();
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const generate = async (apiNames: string[], yearFrom: number, yearTo: number) => {
        setIsGenerating(true);
        setError(null);
        try {
            const data = await fetchCountyScores(apiNames, yearFrom, yearTo);
            onScoresUpdate(data);
        } catch {
            setError(t('filters.loadError'));
        } finally {
            setIsGenerating(false);
        }
    };

    return { generate, isGenerating, error };
};