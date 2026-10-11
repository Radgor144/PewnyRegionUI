import { useState, type ChangeEvent, type RefObject, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import type L from 'leaflet';

import { SEARCH_FIT_MAX_ZOOM, SEARCH_RESULTS_LIMIT } from '../constants';
import { getCountyName, matchesQuery } from '../utils/countySearch';
import { getTeryt } from '../utils/teryt';
import type { CountyFeature, CountyFeatureCollection } from '../types';

interface SearchControlProps {
    geoData: CountyFeatureCollection | null;
    geoJsonRef: RefObject<L.GeoJSON | null>;
    onSelectFeature: (layer: L.Path) => void;
    targetId?: string;
}

export const SearchControl = ({ geoData, geoJsonRef, onSelectFeature, targetId = 'search-portal-target' }: SearchControlProps) => {
    const map = useMap();
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CountyFeature[]>([]);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(document.getElementById(targetId));
    }, [targetId]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (value.trim().length > 1 && geoData) {
            setResults(geoData.features.filter((f) => matchesQuery(f, value)).slice(0, SEARCH_RESULTS_LIMIT));
        } else {
            setResults([]);
        }
    };

    const zoomToFeature = (feature: CountyFeature) => {
        if (!geoJsonRef.current) return;

        const targetTeryt = getTeryt(feature.properties);
        const layers = geoJsonRef.current.getLayers() as any[];

        const targetLayer = layers.find((layer) => {
            const layerTeryt = getTeryt(layer.feature?.properties || {});
            return layerTeryt === targetTeryt;
        });

        if (targetLayer) {
            map.fitBounds(targetLayer.getBounds(), { padding: [30, 30], maxZoom: SEARCH_FIT_MAX_ZOOM });
            onSelectFeature(targetLayer);
        }

        setQuery('');
        setResults([]);
    };

    const searchUI = (
        <div className="relative w-full max-w-sm mx-auto">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={t('map.search')}
                className="w-full h-10 pl-9 pr-3 rounded-xl border text-[13px] font-medium outline-none transition-all"
                style={{
                    backgroundColor: 'var(--color-panel)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                    caretColor: 'var(--color-primary)',
                }}
            />

            {results.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl overflow-hidden border backdrop-blur-md" style={{
                    backgroundColor: 'var(--color-panel)',
                    borderColor: 'var(--color-border)',
                }}>
                    {results.map((feature, index) => (
                        <li
                            key={getTeryt(feature.properties) ?? index}
                            onClick={() => zoomToFeature(feature)}
                            className="cursor-pointer px-3 py-2 transition-colors border-b last:border-0"
                            style={{
                                borderColor: 'var(--color-border)',
                                backgroundColor: 'transparent',
                                color: 'var(--color-text)',
                            }}
                        >
                            <div className="font-semibold text-[12px]" style={{ color: 'var(--color-text)' }}>{getCountyName(feature)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return portalTarget ? createPortal(searchUI, portalTarget) : null;
};