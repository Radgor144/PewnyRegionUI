import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GeoJSON, MapContainer, Pane, TileLayer } from 'react-leaflet';
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

const polandOutlineStyle: PathOptions = {
    color: 'var(--color-map-country-outline)',
    weight: 1,
    opacity: 0.95,
    fill: false,
    lineJoin: 'round',
    lineCap: 'round',
};

interface RegionMapProps {
    scoresData: CountyScore[] | null;
    isOpen: boolean;
    onCountySelect?: (feature: CountyFeature) => void;
}

export const RegionMap = ({ scoresData, isOpen, onCountySelect }: RegionMapProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { data: geoData, loading: isGeoDataLoading, error: geoDataError } = useCountyGeoData();
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

    const featureStyle = useMemo(() => {
        return createFeatureStyleFactory(scoreRange, scoresMap ?? {});
    }, [scoreRange, scoresMap]);

    const tileUrl = isDark ? TILE_URLS.dark : TILE_URLS.light;

    return (
        <div className="absolute inset-0 z-0 transform-gpu" style={{ transform: 'translateZ(0)', backgroundColor: 'var(--color-bg)' }}>
            {scoresData && scoresData.length > 0 && (
                <div className="absolute bottom-6 right-6 z-[9999] pointer-events-auto">
                    <MapLegend scoreRange={scoreRange} />
                </div>
            )}

            <MapContainer center={POLAND_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
                <MapViewportEffects
                    isOpen={isOpen}
                    isDraggingRef={isDraggingRef}
                    isZoomingRef={isZoomingRef}
                    onInteractionStart={handleInteractionStart}
                />

                <SearchControl geoData={geoData?.counties ?? null} geoJsonRef={geoJsonRef} onSelectFeature={selectFeature} targetId="county-search-panel-target" />

                <TileLayer url={tileUrl} attribution={TILE_ATTRIBUTION} />

                {geoData && (
                    <GeoJSON
                        key={geoJsonKey}
                        ref={geoJsonRef}
                        data={geoData.counties}
                        style={featureStyle as (feature?: any) => PathOptions}
                        onEachFeature={onEachFeature}
                    />
                )}
                {geoData && (
                    <Pane
                        name="polandOutline"
                        style={{ zIndex: 450, pointerEvents: 'none' }}
                    >
                        <GeoJSON
                            key={`poland-outline-${theme}`}
                            data={geoData.polandOutline}
                            style={polandOutlineStyle}
                            interactive={false}
                        />
                    </Pane>
                )}
            </MapContainer>
            {(isGeoDataLoading || geoDataError) && (
                <div className="pointer-events-none absolute inset-0 z-[1000] flex items-center justify-center">
                    <p
                        role={geoDataError ? 'alert' : 'status'}
                        className={`rounded-md px-5 py-3 shadow-lg ${geoDataError ? 'text-red-600 dark:text-red-400' : ''}`}
                        style={{
                            backgroundColor: 'var(--color-panel)',
                            color: geoDataError ? undefined : 'var(--color-text)',
                        }}
                    >
                        {t(geoDataError ? 'map.geoDataLoadError' : 'map.geoDataLoading')}
                    </p>
                </div>
            )}
        </div>
    );
};