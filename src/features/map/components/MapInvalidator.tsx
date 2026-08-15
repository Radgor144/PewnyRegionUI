import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapInvalidatorProps {
    isOpen: boolean;
    isDraggingRef: React.MutableRefObject<boolean>;
    geoJsonRef: React.MutableRefObject<L.GeoJSON | null>;
    selectedLayerRef: React.MutableRefObject<L.Path | null>;
    hoverTooltipRef: React.MutableRefObject<L.Tooltip | null>;
    isDark: boolean;
    applyHighlightStyle: (layer: L.Path, isDark: boolean) => void;
}

export const MapInvalidator = ({
                                   isOpen,
                                   isDraggingRef,
                                   geoJsonRef,
                                   selectedLayerRef,
                                   hoverTooltipRef,
                                   isDark,
                                   applyHighlightStyle,
                               }: MapInvalidatorProps) => {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize({ pan: false, animate: false });
        }, 300);

        return () => clearTimeout(timer);
    }, [isOpen, map]);

    useEffect(() => {
        const handleDragStart = () => {
            isDraggingRef.current = true;

            if (hoverTooltipRef.current) {
                map.removeLayer(hoverTooltipRef.current);
                hoverTooltipRef.current = null;
            }

            geoJsonRef.current?.resetStyle();

            if (selectedLayerRef.current) {
                applyHighlightStyle(selectedLayerRef.current, isDark);
            }
        };

        const handleDragEnd = () => {
            setTimeout(() => {
                isDraggingRef.current = false;
            }, 100);
        };

        map.on('dragstart', handleDragStart);
        map.on('dragend', handleDragEnd);

        return () => {
            map.off('dragstart', handleDragStart);
            map.off('dragend', handleDragEnd);
        };
    }, [map, isDraggingRef, geoJsonRef, selectedLayerRef, hoverTooltipRef, isDark, applyHighlightStyle]);

    return null;
};