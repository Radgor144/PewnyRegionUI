import { useCallback, useEffect, useMemo, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import L, { Layer, LeafletMouseEvent, PathOptions } from 'leaflet';
import { useTheme } from 'app/providers/ThemeContext';
import 'leaflet/dist/leaflet.css';

import { MapInvalidator } from "./MapInvalidator";
import { useCountyGeoData } from "../hooks/useCountyGeoData";
import { useCountyScores } from "../hooks/useCountyScores";
import { DEFAULT_ZOOM, POLAND_CENTER, TILE_ATTRIBUTION, TILE_URLS } from "../constants";
import { CountyFeature } from "../types";
import { getTeryt } from "../utils/teryt";
import { getScoreColor } from "../utils/colorScale";
import { buildCountyTooltipHtml } from "../utils/tooltip";
import { SearchControl } from "./SearchControl";
import { CountyScore } from "../../../types/api";

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
export const applyHighlightStyle = (layer: L.Path, isDark: boolean) => {
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

    const isDraggingRef = useRef(false);

    /** The one county currently pinned open (via click or search) — stays open regardless of hover. */
    const selectedLayerRef = useRef<L.Path | null>(null);
    /** Reference to the standalone permanent tooltip for the pinned county */
    const pinnedTooltipRef = useRef<L.Tooltip | null>(null);
    /** Reference to the standalone hover tooltip managed fully by custom mouse events */
    const hoverTooltipRef = useRef<L.Tooltip | null>(null);

    const tileUrl = isDark ? TILE_URLS.dark : TILE_URLS.light;

    const geoJsonKey = useMemo(
        () => (scoresMap ? `${theme}-${JSON.stringify(scoresMap)}` : `${theme}-empty`),
        [scoresMap, theme]
    );

    useEffect(() => {
        selectedLayerRef.current = null;

        if (pinnedTooltipRef.current) {
            pinnedTooltipRef.current.remove();
            pinnedTooltipRef.current = null;
        }
        if (hoverTooltipRef.current) {
            hoverTooltipRef.current.remove();
            hoverTooltipRef.current = null;
        }
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
            const map = (layer as any)._map as L.Map;

            if (previous && previous !== layer) {
                geoJsonRef.current?.resetStyle(previous);
            }

            if (pinnedTooltipRef.current && map) {
                map.removeLayer(pinnedTooltipRef.current);
                pinnedTooltipRef.current = null;
            }

            if (hoverTooltipRef.current && map) {
                map.removeLayer(hoverTooltipRef.current);
                hoverTooltipRef.current = null;
            }

            selectedLayerRef.current = layer;
            applyHighlightStyle(layer, isDark);

            if (map) {
                const feature = (layer as any).feature;
                const teryt = getTeryt(feature.properties);
                const score = teryt && scoresMap ? scoresMap[teryt] : undefined;
                const centerPoint = (layer as L.Polygon).getBounds().getCenter();

                const tooltip = L.tooltip({
                    className: 'custom-tooltip',
                    direction: 'top',
                    permanent: true
                })
                    .setLatLng(centerPoint)
                    .setContent(buildCountyTooltipHtml(feature, score));

                tooltip.addTo(map);
                pinnedTooltipRef.current = tooltip;
            }
        },
        [isDark, scoresMap]
    );

    const highlightFeature = (event: LeafletMouseEvent) => {
        if (event.originalEvent.buttons !== 0) return;
        if (isDraggingRef.current) return;
        const layer = event.target as L.Path;
        if (layer === selectedLayerRef.current) return;

        applyHighlightStyle(layer, isDark);

        const map = (layer as any)._map as L.Map;
        if (!map) return;

        if (hoverTooltipRef.current) {
            map.removeLayer(hoverTooltipRef.current);
            hoverTooltipRef.current = null;
        }

        const feature = (layer as any).feature;
        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        const tooltip = L.tooltip({
            className: 'custom-tooltip',
            direction: 'top',
        })
            .setLatLng(event.latlng)
            .setContent(buildCountyTooltipHtml(feature, score));

        tooltip.addTo(map);
        hoverTooltipRef.current = tooltip;
    };

    const moveHighlight = (event: LeafletMouseEvent) => {
        if (hoverTooltipRef.current) {
            hoverTooltipRef.current.setLatLng(event.latlng);
        }
    };

    const resetHighlight = (event: LeafletMouseEvent) => {
        const layer = event.target as L.Path;

        if (layer === selectedLayerRef.current) {
            return;
        }

        geoJsonRef.current?.resetStyle(layer);

        const map = (layer as any)._map as L.Map;
        if (hoverTooltipRef.current && map) {
            map.removeLayer(hoverTooltipRef.current);
            hoverTooltipRef.current = null;
        }

        if (selectedLayerRef.current) {
            bringToFront(selectedLayerRef.current);
        }
    };

    const handleFeatureClick = (event: LeafletMouseEvent) => {
        if (isDraggingRef.current) return;
        selectFeature(event.target as L.Path);
    };

    const onEachFeature = (feature: CountyFeature, layer: Layer) => {

        layer.on({
            mouseover: highlightFeature as (event: L.LeafletEvent) => void,
            mousemove: moveHighlight as (event: L.LeafletEvent) => void,
            mouseout: resetHighlight as (event: L.LeafletEvent) => void,
            click: handleFeatureClick as (event: L.LeafletEvent) => void,
        });
    };

    return (
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950 transform-gpu" style={{ transform: 'translateZ(0)' }}>
            <MapContainer center={POLAND_CENTER} zoom={DEFAULT_ZOOM} className="h-full w-full" zoomControl={false}>
                <MapInvalidator
                    isOpen={isOpen}
                    isDraggingRef={isDraggingRef}
                    geoJsonRef={geoJsonRef}
                    selectedLayerRef={selectedLayerRef}
                    hoverTooltipRef={hoverTooltipRef}
                    isDark={isDark}
                    applyHighlightStyle={applyHighlightStyle}
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
                        style={getFeatureStyle as (feature?: any) => PathOptions}
                        onEachFeature={onEachFeature as (feature: any, layer: Layer) => void}
                    />
                )}
            </MapContainer>
        </div>
    );
};