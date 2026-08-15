import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CountyScore } from '../../../types/api';
import {fetchCountyScores} from "../../map";

interface UseGenerateCountyScoresResult {
    generate: (apiNames: string[], yearFrom: number, yearTo: number) => Promise<void>;
    isGenerating: boolean;
    error: string | null;
}

export const useGenerateCountyScores = (
    onScoresUpdate: (data: CountyScore[]) => void
): UseGenerateCountyScoresResult => {
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