import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const useMapZoomGuard = (
    isZoomingRef: React.RefObject<boolean>,
    onZoomStart: () => void
) => {
    const map = useMap();

    useEffect(() => {
        const handleZoomStart = () => {
            isZoomingRef.current = true;
            onZoomStart();
        };
        const handleZoomEnd = () => {
            isZoomingRef.current = false;
        };

        map.on('zoomstart', handleZoomStart);
        map.on('zoomend', handleZoomEnd);

        return () => {
            map.off('zoomstart', handleZoomStart);
            map.off('zoomend', handleZoomEnd);
        };
    }, [map, isZoomingRef, onZoomStart]);
};