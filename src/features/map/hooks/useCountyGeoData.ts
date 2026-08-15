import { useEffect, useState } from 'react';
import { GEOJSON_URL } from '../constants';
import { getTeryt } from '../utils/teryt';
import type { CountyFeatureCollection } from '../types';

export const useCountyGeoData = (): CountyFeatureCollection | null => {
    const [geoData, setGeoData] = useState<CountyFeatureCollection | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetch(GEOJSON_URL)
            .then((response) => response.json())
            .then((data: CountyFeatureCollection) => {
                if (!isMounted) return;

                setGeoData({
                    ...data,
                    features: data.features.filter((feature) => {
                        const teryt = getTeryt(feature.properties);
                        return teryt && teryt.length === 4;
                    }),
                });
            })
            .catch((error) => {
                console.error('Failed to load county boundaries:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return geoData;
};