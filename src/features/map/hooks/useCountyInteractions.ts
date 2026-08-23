import { useRef, useCallback } from 'react';
import L, { LeafletMouseEvent, Layer } from 'leaflet';
import { getTeryt } from '../utils/teryt';
import { buildCountyTooltipHtml } from '../utils/tooltip';
import { applyHighlightStyle, bringToFront } from '../utils/mapStyle';
import type { CountyFeature, ScoresLookup } from '../types';

interface UseCountyInteractionsProps {
    scoresMap: ScoresLookup | null;
    isDark: boolean;
    geoJsonRef: React.MutableRefObject<L.GeoJSON | null>;
    isDraggingRef: React.MutableRefObject<boolean>;
}

export const useCountyInteractions = ({
                                          scoresMap,
                                          isDark,
                                          geoJsonRef,
                                          isDraggingRef,
                                      }: UseCountyInteractionsProps) => {
    const selectedLayerRef = useRef<L.Path | null>(null);
    const pinnedTooltipRef = useRef<L.Tooltip | null>(null);
    const hoverTooltipRef = useRef<L.Tooltip | null>(null);

    const clearHover = useCallback(() => {
        if (hoverTooltipRef.current) {
            hoverTooltipRef.current.remove();
            hoverTooltipRef.current = null;
        }
    }, []);

    const clearPinned = useCallback(() => {
        if (pinnedTooltipRef.current) {
            pinnedTooltipRef.current.remove();
            pinnedTooltipRef.current = null;
        }
    }, []);

    const selectFeature = useCallback((layer: L.Path) => {
        const previous = selectedLayerRef.current;
        const map = (layer as any)._map as L.Map;

        if (previous && previous !== layer) {
            geoJsonRef.current?.resetStyle(previous);
        }

        clearPinned();
        clearHover();

        selectedLayerRef.current = layer;
        applyHighlightStyle(layer, isDark);

        if (map) {
            const feature = (layer as any).feature;
            const teryt = getTeryt(feature.properties);
            const score = teryt && scoresMap ? scoresMap[teryt] : undefined;
            const centerPoint = (layer as L.Polygon).getBounds().getCenter();

            pinnedTooltipRef.current = L.tooltip({
                className: 'custom-tooltip',
                direction: 'top',
                permanent: true,
            })
                .setLatLng(centerPoint)
                .setContent(buildCountyTooltipHtml(feature, score))
                .addTo(map);
        }
    }, [isDark, scoresMap, clearPinned, clearHover, geoJsonRef]);

    const highlightFeature = useCallback((event: LeafletMouseEvent) => {
        if (event.originalEvent.buttons !== 0 || isDraggingRef.current) return;

        const layer = event.target as L.Path;
        if (layer === selectedLayerRef.current) return;

        applyHighlightStyle(layer, isDark);

        const map = (layer as any)._map as L.Map;
        if (!map) return;

        clearHover();

        const feature = (layer as any).feature;
        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        hoverTooltipRef.current = L.tooltip({
            className: 'custom-tooltip',
            direction: 'top',
        })
            .setLatLng(event.latlng)
            .setContent(buildCountyTooltipHtml(feature, score))
            .addTo(map);
    }, [isDark, scoresMap, isDraggingRef, clearHover]);

    const moveHighlight = useCallback((event: LeafletMouseEvent) => {
        if (hoverTooltipRef.current) {
            hoverTooltipRef.current.setLatLng(event.latlng);
        }
    }, []);

    const resetHighlight = useCallback((event: LeafletMouseEvent) => {
        const layer = event.target as L.Path;
        if (layer === selectedLayerRef.current) return;

        geoJsonRef.current?.resetStyle(layer);
        clearHover();

        if (selectedLayerRef.current) {
            bringToFront(selectedLayerRef.current);
        }
    }, [clearHover, geoJsonRef]);

    const handleFeatureClick = useCallback((event: LeafletMouseEvent) => {
        if (isDraggingRef.current) return;
        selectFeature(event.target as L.Path);
    }, [isDraggingRef, selectFeature]);

    const onEachFeature = useCallback((_feature: CountyFeature, layer: Layer) => {
        layer.on({
            mouseover: highlightFeature as any,
            mousemove: moveHighlight as any,
            mouseout: resetHighlight as any,
            click: handleFeatureClick as any,
        });
    }, [highlightFeature, moveHighlight, resetHighlight, handleFeatureClick]);

    const resetAll = useCallback(() => {
        selectedLayerRef.current = null;
        clearPinned();
        clearHover();
    }, [clearHover, clearPinned]);

    const handleDragStart = useCallback(() => {
        clearHover();
        geoJsonRef.current?.resetStyle();
        if (selectedLayerRef.current) {
            applyHighlightStyle(selectedLayerRef.current, isDark);
        }
    }, [clearHover, geoJsonRef, isDark]);

    return { onEachFeature, selectFeature, resetAll, handleDragStart };
};