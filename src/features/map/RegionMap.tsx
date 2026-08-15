import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import L, { Layer, LeafletMouseEvent, PathOptions } from 'leaflet';
import { useTheme } from 'context/ThemeContext';
import 'leaflet/dist/leaflet.css';

import {MapInvalidator} from "./components/MapInvalidator";
import {useCountyGeoData} from "./hooks/useCountyGeoData";
import {useCountyScores} from "./hooks/useCountyScores";
import {DEFAULT_ZOOM, POLAND_CENTER, TILE_ATTRIBUTION, TILE_URLS} from "./constants";
import {CountyFeature} from "./types";
import {getTeryt} from "./utils/teryt";
import {getScoreColor} from "./utils/colorScale";
import {buildCountyTooltipHtml} from "./utils/tooltip";
import {SearchControl} from "./components/SearchControl";
import {CountyScore} from "../../types/api";

interface RegionMapProps {
    scoresData: CountyScore[] | null;
    isOpen: boolean;
}

const HIGHLIGHT_WEIGHT = 2;

/** Raises a path above its siblings; guards against the SVG z-order bug in old IE/Opera/Edge. */
const bringToFront = (layer: L.Path) => {
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

/** The style shared by a hovered county and the currently-pinned (selected) one. */
const applyHighlightStyle = (layer: L.Path, isDark: boolean) => {
    layer.setStyle({
        weight: HIGHLIGHT_WEIGHT,
        color: isDark ? '#f8fafc' : '#0f172a',
        fillOpacity: 1,
    });
    bringToFront(layer);
};

export const RegionMap = ({ scoresData, isOpen }: RegionMapProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const geoData = useCountyGeoData();
    const { scoresMap, scoreRange } = useCountyScores(scoresData);
    const geoJsonRef = useRef<L.GeoJSON | null>(null);

    /** The one county currently pinned open (via click or search) — stays open regardless of hover. */
    const selectedLayerRef = useRef<L.Path | null>(null);

    const tileUrl = isDark ? TILE_URLS.dark : TILE_URLS.light;

    // Forces Leaflet to redraw every county shape when the theme or score data changes.
    const geoJsonKey = useMemo(
        () => (scoresMap ? `${theme}-${JSON.stringify(scoresMap)}` : `${theme}-empty`),
        [scoresMap, theme]
    );

    // The previous GeoJSON layer — and every layer object in it — is discarded whenever
    // geoJsonKey changes, so any layer we were holding onto is now stale.
    useEffect(() => {
        selectedLayerRef.current = null;
    }, [geoJsonKey]);

    const getFeatureStyle = (feature?: CountyFeature): PathOptions => {
        const noDataStyle: PathOptions = {
            color: isDark ? '#1e293b' : '#cbd5e1',
            weight: 0.8,
            fillColor: isDark ? '#020617' : '#f8fafc',
            fillOpacity: isDark ? 0.5 : 0.6,
        };

        if (!feature) return noDataStyle;

        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        if (score == null) return noDataStyle;

        return {
            color: isDark ? '#0f172a' : '#ffffff',
            weight: isDark ? 1 : 0.8,
            fillColor: getScoreColor(score, scoreRange),
            fillOpacity: isDark ? 0.85 : 0.9,
        };
    };

    /** Pins a county open: highlights it and keeps its tooltip visible until another county is selected. */
    const selectFeature = useCallback(
        (layer: L.Path) => {
            const previous = selectedLayerRef.current;
            if (previous && previous !== layer) {
                geoJsonRef.current?.resetStyle(previous);
                previous.closeTooltip();
            }

            selectedLayerRef.current = layer;
            applyHighlightStyle(layer, isDark);
            layer.openTooltip();
        },
        [isDark]
    );

    const highlightFeature = (event: LeafletMouseEvent) => {
        const layer = event.target as L.Path;
        if (layer === selectedLayerRef.current) return; // already highlighted and open

        applyHighlightStyle(layer, isDark);
        layer.openTooltip();
    };

    const resetHighlight = (event: LeafletMouseEvent) => {
        const layer = event.target as L.Path;

        if (layer === selectedLayerRef.current) {
            // Leaflet auto-closes non-permanent tooltips on mouseout regardless of
            // this handler — reopen immediately so the pinned tooltip stays visible.
            layer.openTooltip();
            return;
        }

        geoJsonRef.current?.resetStyle(layer);
        layer.closeTooltip();

        // This neighbor may have been raised above the selected county while
        // hovered, hiding part of its border along their shared edge.
        if (selectedLayerRef.current) {
            bringToFront(selectedLayerRef.current);
        }
    };

    const handleFeatureClick = (event: LeafletMouseEvent) => {
        selectFeature(event.target as L.Path);
    };

    const onEachFeature = (feature: CountyFeature, layer: Layer) => {
        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        layer.bindTooltip(buildCountyTooltipHtml(feature, score), {
            className: 'custom-tooltip',
            direction: 'top',
            sticky: true,
            permanent: false,
        });

        layer.on({
            mouseover: highlightFeature as (event: L.LeafletEvent) => void,
            mouseout: resetHighlight as (event: L.LeafletEvent) => void,
            click: handleFeatureClick as (event: L.LeafletEvent) => void,
        });
    };

    return (
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950 transform-gpu" style={{ transform: 'translateZ(0)' }}>
            <MapContainer center={POLAND_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
                <MapInvalidator isOpen={isOpen} />

                {/* Dodano stałą szerokość (max-w-md / w-full), aby element nie zwijał się do 0 */}
                <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4 pointer-events-auto">
                    <SearchControl geoData={geoData} geoJsonRef={geoJsonRef} onSelectFeature={selectFeature} />
                </div>

                <TileLayer url={tileUrl} attribution={TILE_ATTRIBUTION} />

                {geoData && (
                    <GeoJSON
                        key={geoJsonKey}
                        ref={geoJsonRef}
                        data={geoData}
                        style={getFeatureStyle as (feature?: any) => PathOptions}
                        onEachFeature={onEachFeature as (feature: any, layer: Layer) => void}
                    />
                )}
            </MapContainer>
        </div>
    );
};