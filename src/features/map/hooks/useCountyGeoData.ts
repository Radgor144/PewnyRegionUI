import { useEffect, useState } from 'react';
import { GEOJSON_URL } from '../constants';
import { getTeryt } from '../utils/teryt';
import { createPolandOutline } from '../utils/polandOutline';
import type { CountyFeatureCollection, CountyGeoData } from 'features/map/types';

export const useCountyGeoData = (): CountyGeoData | null => {
    const [geoData, setGeoData] = useState<CountyGeoData | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetch(GEOJSON_URL)
            .then((res) => res.json())
            .then((data: CountyFeatureCollection) => {
                if (!isMounted) return;
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
            })
            .catch(console.error);

        return () => { isMounted = false; };
    }, []);

    return geoData;
};