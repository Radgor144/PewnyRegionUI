import { apiClient } from '../../../lib/api-client';
import type { Variable } from '../../../types/api';

export const fetchVariables = (): Promise<Variable[]> =>
    apiClient.get<Variable[]>('/api/variables');