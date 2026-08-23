import React, {useEffect} from 'react';
import {useMap} from 'react-leaflet';

export const useMapDragCleanup = (
    isDraggingRef: React.RefObject<boolean>,
    onDragStart: () => void
) => {
    const map = useMap();

    useEffect(() => {
        const handleDragStart = () => {
            isDraggingRef.current = true;
            onDragStart();
        };

        const handleDragEnd = () => {
            setTimeout(() => { isDraggingRef.current = false; }, 100);
        };

        map.on('dragstart', handleDragStart);
        map.on('dragend', handleDragEnd);

        return () => {
            map.off('dragstart', handleDragStart);
            map.off('dragend', handleDragEnd);
        };
    }, [map, isDraggingRef, onDragStart]);
};