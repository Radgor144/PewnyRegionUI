import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Variable } from 'types/api';
import { useCountyDetails } from './useCountyDetails';
import { fetchCountyDetails } from '../api/getCountyDetails';

vi.mock('react-i18next', () => ({
    useTranslation: (() => {
        const t = (_key: string, fallback: string) => fallback;
        return () => ({ t });
    })(),
}));

vi.mock('../api/getCountyDetails', () => ({
    fetchCountyDetails: vi.fn(),
}));

const selectedVariables: Variable[] = [
    {
        apiName: 'crime_detection_rate',
        category: 'SAFETY',
        bdlIds: [58565, 1749170],
        direction: 'STIMULANT',
        per_capita: false,
        unit: '%',
    },
    {
        apiName: 'crimes_total',
        category: 'SAFETY',
        bdlIds: [58559, 1749155],
        direction: 'DESTIMULANT',
        per_capita: true,
        unit: 'per_1000',
    },
];

describe('useCountyDetails', () => {
    it('does not load chart data from filters before a county is selected', () => {
        const fetchMock = vi.mocked(fetchCountyDetails);
        fetchMock.mockReset();

        const { result } = renderHook(() => useCountyDetails(null));

        expect(result.current.data).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it('groups response data by variable apiName', async () => {
        const fetchMock = vi.mocked(fetchCountyDetails);
        fetchMock.mockReset();
        fetchMock.mockResolvedValue({
            terytCode: '2401',
            variables: [
                {
                    apiName: 'crime_detection_rate',
                    yearlyValues: [{ year: 2025, rawValue: 66.9, averageScore: 73.51 }],
                },
                {
                    apiName: 'crimes_total',
                    yearlyValues: [{ year: 2025, rawValue: 5195, averageScore: 2792.73 }],
                },
            ],
        });

        const request = { terytCode: '2401', selectedVariables };
        const { result, rerender } = renderHook(
            ({ currentRequest }) => useCountyDetails(currentRequest),
            { initialProps: { currentRequest: request } },
        );

        await waitFor(() => expect(result.current.data).not.toBeNull());

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(
            '2401',
            ['crime_detection_rate', 'crimes_total'],
            expect.any(AbortSignal)
        );
        expect(result.current.data).toEqual([
            {
                apiName: 'crime_detection_rate',
                variables: [
                    {
                        apiName: 'crime_detection_rate',
                        yearlyValues: [{ year: 2025, rawValue: 66.9, averageScore: 73.51 }],
                    },
                ],
            },
            {
                apiName: 'crimes_total',
                variables: [
                    {
                        apiName: 'crimes_total',
                        yearlyValues: [{ year: 2025, rawValue: 5195, averageScore: 2792.73 }],
                    },
                ],
            },
        ]);

        rerender({ currentRequest: request });
        expect(fetchMock).toHaveBeenCalledTimes(1);

        rerender({
            currentRequest: {
                terytCode: '2401',
                selectedVariables: [...selectedVariables],
            },
        });
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    });
});
