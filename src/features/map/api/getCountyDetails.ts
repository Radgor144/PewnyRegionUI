import { apiClient } from 'lib/api-client';
import type { CountyDetailsResponse } from 'types/api';

export const fetchCountyDetails = (
    terytCode: string,
    apiNames: string[],
    signal?: AbortSignal
): Promise<CountyDetailsResponse> => {
    const params = new URLSearchParams();

    params.append('terytCode', terytCode);
    apiNames.forEach((apiName) => params.append('apiNames', apiName));

    return apiClient.get<CountyDetailsResponse>(
        `/api/countyDetails?${params.toString()}`,
        { signal }
    );
};
