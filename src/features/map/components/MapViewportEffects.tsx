import {useInvalidateMapSizeOnToggle} from '../hooks/useInvalidateMapSizeOnToggle';
import {useMapDragCleanup} from '../hooks/useMapDragCleanup';
import React from "react";

interface MapViewportEffectsProps {
    isOpen: boolean;
    isDraggingRef: React.RefObject<boolean>;
    onDragStart: () => void;
}

export const MapViewportEffects = ({ isOpen, isDraggingRef, onDragStart }: MapViewportEffectsProps) => {
    useInvalidateMapSizeOnToggle(isOpen);
    useMapDragCleanup(isDraggingRef, onDragStart);
    return null;
};