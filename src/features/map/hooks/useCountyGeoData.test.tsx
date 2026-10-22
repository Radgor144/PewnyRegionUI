import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCountyGeoData } from './useCountyGeoData';

describe('useCountyGeoData', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('exposes an error when the GeoJSON request is not successful', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 503,
        }));

        const { result } = renderHook(() => useCountyGeoData());

        await waitFor(() => {
            expect(result.current).toMatchObject({
                loading: false,
                error: expect.any(Error),
            });
        });
        expect(result.current.error?.message).toContain('503');
    });

    it('returns GeoJSON and clears loading after a successful response', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: { teryt: '1234', typ: 'woj' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [[[0, 0], [1, 0], [1, 1], [0, 0]]],
                    },
                }],
            }),
        }));

        const { result } = renderHook(() => useCountyGeoData());

        await waitFor(() => {
            expect(result.current).toMatchObject({
                loading: false,
                error: null,
                data: {
                    counties: { features: [{ properties: { teryt: '1234' } }] },
                    polandOutline: { geometry: { type: 'MultiLineString' } },
                },
            });
        });
    });

    it('aborts the GeoJSON request when the hook unmounts', () => {
        let requestSignal: AbortSignal | undefined;
        vi.stubGlobal('fetch', vi.fn((_url: string, options?: RequestInit) => {
            requestSignal = options?.signal as AbortSignal | undefined;
            return new Promise<Response>(() => {});
        }));

        const { unmount } = renderHook(() => useCountyGeoData());

        act(() => unmount());

        expect(requestSignal?.aborted).toBe(true);
    });
});
