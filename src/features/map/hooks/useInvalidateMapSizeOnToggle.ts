import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const useInvalidateMapSizeOnToggle = (isOpen: boolean) => {
    const map = useMap();

    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize({ pan: false, animate: false });
        }, 300);
        return () => clearTimeout(timer);
    }, [isOpen, map]);
};