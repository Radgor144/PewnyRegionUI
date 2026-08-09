import { useRef } from 'react';
import { GeoJSON } from 'react-leaflet';

const MapComponent = ({ geoData }) => {
    const geoJsonRef = useRef();

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                    weight: 3,
                    color: '#333',
                    fillOpacity: 0.7,
                });
                layer.bringToFront();
            },
            mouseout: (e) => {
                if (geoJsonRef.current) {
                    geoJsonRef.current.resetStyle(e.target);
                }
            }
        });
    };

    return (
        <GeoJSON
            ref={geoJsonRef}
            data={geoData}
            onEachFeature={onEachFeature}
        />
    );
};

export default MapComponent;