import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

interface MapInvalidatorProps {
    isOpen: boolean;
}

export const MapInvalidator = ({ isOpen }: MapInvalidatorProps) => {
    const map = useMap();

    useEffect(() => {
        // Uruchamiamy przeliczanie rozmiaru dopiero po zakończeniu animacji CSS (300ms).
        // Zapobiega to jakimkolwiek skokom w trakcie samego wysuwania/chowwania panelu.
        const timer = setTimeout(() => {
            map.invalidateSize({ pan: false, animate: false });
        }, 300);

        return () => clearTimeout(timer);
    }, [isOpen, map]);

    return null;
};