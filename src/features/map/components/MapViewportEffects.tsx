import React from "react";
import { useInvalidateMapSizeOnToggle } from '../hooks/useInvalidateMapSizeOnToggle';
import { useMapDragCleanup } from '../hooks/useMapDragCleanup';
import { useMapZoomGuard } from '../hooks/useMapZoomGuard';

interface MapViewportEffectsProps {
    isOpen: boolean;
    isDraggingRef: React.RefObject<boolean>;
    isZoomingRef: React.RefObject<boolean>;
    onInteractionStart: () => void;
}

export const MapViewportEffects = ({
                                       isOpen,
                                       isDraggingRef,
                                       isZoomingRef,
                                       onInteractionStart
                                   }: MapViewportEffectsProps) => {
    useInvalidateMapSizeOnToggle(isOpen);
    useMapDragCleanup(isDraggingRef, onInteractionStart);
    useMapZoomGuard(isZoomingRef, onInteractionStart);

    return null;
};