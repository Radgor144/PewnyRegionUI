import { apiClient } from 'lib/api-client';
import type { CountyScore } from 'types/api';

export const fetchCountyScores = (
    apiNames: string[],
    yearFrom: number,
    yearTo: number
): Promise<CountyScore[]> =>
    apiClient.post<CountyScore[]>('/api/map/county-scores', { apiNames, yearFrom, yearTo });