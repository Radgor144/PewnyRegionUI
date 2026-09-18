import { useEffect, useMemo, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import L, { PathOptions } from 'leaflet';
import { useTheme } from 'app/providers/ThemeContext';
import 'leaflet/dist/leaflet.css';

import { MapViewportEffects } from './MapViewportEffects';
import { MapLegend } from './MapLegend';
import { SearchControl } from './SearchControl';

import { useCountyGeoData } from '../hooks/useCountyGeoData';
import { useCountyScores } from '../hooks/useCountyScores';
import { useCountyInteractions } from '../hooks/useCountyInteractions';
import { createFeatureStyleFactory } from '../utils/mapStyle';

import { DEFAULT_ZOOM, POLAND_CENTER, TILE_ATTRIBUTION, TILE_URLS } from '../constants';
import type { CountyScore } from '../../../types/api';
import type { CountyFeature } from '../types';

interface RegionMapProps {
    scoresData: CountyScore[] | null;
    isOpen: boolean;
    onCountySelect?: (feature: CountyFeature) => void;
}

export const RegionMap = ({ scoresData, isOpen, onCountySelect }: RegionMapProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const geoData = useCountyGeoData();
    const { scoresMap, scoreRange, scoresVersion } = useCountyScores(scoresData);

    const geoJsonRef = useRef<L.GeoJSON | null>(null);
    const isDraggingRef = useRef(false);
    const isZoomingRef = useRef(false);

    const { onEachFeature, selectFeature, resetAll, handleInteractionStart } = useCountyInteractions({
        scoresMap,
        isDark,
        geoJsonRef,
        isDraggingRef,
        isZoomingRef,
        onFeatureSelect: onCountySelect,
    });

    const geoJsonKey = `${theme}-${scoresVersion}`;

    useEffect(() => {
        resetAll();
    }, [geoJsonKey, resetAll]);

    const featureStyle = useMemo(() =>
            createFeatureStyleFactory(isDark, scoreRange, scoresMap),
        [isDark, scoreRange, scoresMap]);

    const tileUrl = isDark ? TILE_URLS.dark : TILE_URLS.light;

    return (
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950 transform-gpu" style={{ transform: 'translateZ(0)' }}>
            <div className="absolute bottom-6 right-6 z-[9999] pointer-events-auto">
                <MapLegend scoreRange={scoreRange} />
            </div>

            <MapContainer center={POLAND_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
                <MapViewportEffects
                    isOpen={isOpen}
                    isDraggingRef={isDraggingRef}
                    isZoomingRef={isZoomingRef}
                    onInteractionStart={handleInteractionStart}
                />

                <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4 pointer-events-auto">
                    <SearchControl geoData={geoData} geoJsonRef={geoJsonRef} onSelectFeature={selectFeature} />
                </div>

                <TileLayer url={tileUrl} attribution={TILE_ATTRIBUTION} />

                {geoData && (
                    <GeoJSON
                        key={geoJsonKey}
                        ref={geoJsonRef}
                        data={geoData}
                        style={featureStyle as (feature?: any) => PathOptions}
                        onEachFeature={onEachFeature}
                    />
                )}
            </MapContainer>
        </div>
    );
};