import { useState, type ChangeEvent, type RefObject, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMap } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import type L from 'leaflet';
import { SEARCH_FIT_MAX_ZOOM, SEARCH_RESULTS_LIMIT } from '../constants';
import type { CountyFeature, CountyFeatureCollection } from '../types';

interface SearchControlProps {
    geoData: CountyFeatureCollection | null;
    geoJsonRef: RefObject<L.GeoJSON | null>;
    onSelectFeature: (layer: L.Path) => void;
}

const getCountyName = (feature: CountyFeature): string => feature.properties.nazwa ?? feature.properties.JPT_NAZWA_ ?? '';
const normalizeText = (text: string): string => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const matchesQuery = (feature: CountyFeature, query: string): boolean => normalizeText(getCountyName(feature)).includes(normalizeText(query));

export const SearchControl = ({ geoData, geoJsonRef, onSelectFeature }: SearchControlProps) => {
    const map = useMap();
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CountyFeature[]>([]);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    // Znajdź TopBar, by tam wyrenderować wyszukiwarkę
    useEffect(() => {
        setPortalTarget(document.getElementById('search-portal-target'));
    }, []);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setQuery(value);
        if (value.trim().length > 1 && geoData) {
            setResults(geoData.features.filter((feature) => matchesQuery(feature, value)).slice(0, SEARCH_RESULTS_LIMIT));
        } else {
            setResults([]);
        }
    };

    const zoomToFeature = (feature: CountyFeature) => {
        if (!geoJsonRef.current) return;
        const targetTeryt = feature.properties.teryt ?? feature.properties.JPT_KOD_JE;
        const layers = geoJsonRef.current.getLayers() as any[];
        const targetLayer = layers.find((layer) => {
            const layerTeryt = layer.feature?.properties?.teryt ?? layer.feature?.properties?.JPT_KOD_JE;
            return layerTeryt === targetTeryt;
        });

        if (targetLayer) {
            map.fitBounds(targetLayer.getBounds(), { padding: [30, 30], maxZoom: SEARCH_FIT_MAX_ZOOM });
            onSelectFeature(targetLayer);
        }

        setQuery(''); // Czyści input po wyszukaniu
        setResults([]);
    };

    const searchUI = (
        <div className="relative w-full z-[1000]">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>

            <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={t('map.search')}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-100 dark:bg-[#1f2937]/50 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#1f2937] transition-all"
            />

            {results.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1f2937] rounded-xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700 backdrop-blur-md">
                    {results.map((feature, index) => (
                        <li key={feature.properties.teryt ?? index} onClick={() => zoomToFeature(feature)} className="cursor-pointer px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-700/50 last:border-0">
                            <div className="font-semibold text-sm text-slate-900 dark:text-slate-100">{getCountyName(feature)}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    // Renderuj w portalu na pasku górnym
    return portalTarget ? createPortal(searchUI, portalTarget) : searchUI;
};