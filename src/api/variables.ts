import { apiClient } from './client';
import { Variable, CountyScore } from './types';

export const fetchVariables = (): Promise<Variable[]> =>
    apiClient.get<Variable[]>('/api/variables');

export const fetchCountyScores = (
    apiNames: string[],
    yearFrom: number,
    yearTo: number
): Promise<CountyScore[]> =>
    apiClient.post<CountyScore[]>('/api/map/county-scores', { apiNames, yearFrom, yearTo });