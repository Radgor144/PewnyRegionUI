import { useEffect, useState } from 'react';
import { GEOJSON_URL } from '../constants';
import { getTeryt } from '../utils/teryt';
import { createPolandOutline } from '../utils/polandOutline';
import type { CountyFeatureCollection, CountyGeoData } from 'features/map/types';

interface UseCountyGeoDataResult {
    data: CountyGeoData | null;
    loading: boolean;
    error: Error | null;
}

export const useCountyGeoData = (): UseCountyGeoDataResult => {
    const [geoData, setGeoData] = useState<CountyGeoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const abortController = new AbortController();
        setLoading(true);
        setError(null);

        fetch(GEOJSON_URL, { signal: abortController.signal })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`GeoJSON request failed with status ${res.status}.`);
                }
                return res.json();
            })
            .then((data: CountyFeatureCollection) => {
                if (abortController.signal.aborted) return;
                const counties = {
                    ...data,
                    features: data.features.filter((feature) => {
                        const teryt = getTeryt(feature.properties);
                        return teryt && teryt.length === 4;
                    }),
                };

                setGeoData({
                    counties,
                    polandOutline: createPolandOutline(data.features),
                });
                setLoading(false);
            })
            .catch((err: unknown) => {
                if (abortController.signal.aborted) return;
                setError(err instanceof Error ? err : new Error('Failed to load county GeoJSON.'));
                setLoading(false);
            });

        return () => abortController.abort();
    }, []);

    return { data: geoData, loading, error };
};