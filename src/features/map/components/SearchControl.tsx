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
        <div className="relative w-full max-w-sm mx-auto z-[1000]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={t('map.search')}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-panel-dark/50 text-xs font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-panel-dark transition-all"
            />

            {results.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-panel-dark rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                    {results.map((feature, index) => (
                        <li key={getTeryt(feature.properties) ?? index} onClick={() => zoomToFeature(feature)} className="cursor-pointer px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                            <div className="font-semibold text-xs text-slate-900 dark:text-slate-100">{getCountyName(feature)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return portalTarget ? createPortal(searchUI, portalTarget) : null;
};