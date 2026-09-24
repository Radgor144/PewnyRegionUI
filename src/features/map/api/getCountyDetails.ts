import { apiClient } from 'lib/api-client';
import type { CountyDetailsResponse } from 'types/api';

export const fetchCountyDetails = (
    terytCode: string,
    bdlVariableIds: number[],
    signal?: AbortSignal
): Promise<CountyDetailsResponse> => {
    const params = new URLSearchParams();
    params.append('terytCode', terytCode);
    bdlVariableIds.forEach((id) => params.append('bdlVariableIds', id.toString()));

    return apiClient.get<CountyDetailsResponse>(
        `/api/countyDetails?${params.toString()}`,
        { signal }
    );
};
