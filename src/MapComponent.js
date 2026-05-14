import React, {useEffect, useState} from 'react';
import {GeoJSON, MapContainer, TileLayer} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
    const [geoData, setGeoData] = useState(null);

    useEffect(() => {
        fetch('/data/powiaty.geojson')
            .then(res => res.json())
            .then(data => {
                const countiesOnly = {
                    ...data,
                    features: data.features.filter(f => {
                        const kod = f.properties.JPT_KOD_JE || f.properties.teryt;
                        return kod && (kod.length === 4);
                    })
                };
                setGeoData(countiesOnly);
            });
    }, []);

    const onCountyClick = (event) => {
        const layer = event.target;
        const props = layer.feature.properties;

        const teryt = props.JPT_KOD_JE || props.teryt;

        layer.bindPopup("Loading data from GUS").openPopup();

        const url = `http://localhost:8080/api/analytics/population/${teryt}`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Error fetching data");
                return res.json();
            })
            .then(data => {
                const result = data.results[0];
                const values = result.values;
                const latestData = values[values.length - 1];
                const populationCount = Math.round(latestData.val * 1000);

                layer.setPopupContent(`
                    <div style="font-family: sans-serif; min-width: 160px;">
                        <strong style="font-size: 14px; color: #2c3e50;">${data.unitName}</strong><br/>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 8px 0;"/>
                        <div style="margin-bottom: 4px;">
                            <span style="color: #666;">Rok:</span> 
                            <strong>${latestData.year}</strong>
                        </div>
                        <div>
                            <span style="color: #666;">Populacja:</span> 
                            <strong style="color: #e67e22;">${populationCount.toLocaleString()}</strong> osób
                        </div>
                        <div style="font-size: 10px; color: #999; margin-top: 8px;">
                            Kod jednostki: ${data.unitId}
                        </div>
                    </div>
                `);
            })
            .catch(err => {
                layer.setPopupContent("Error: Not found data for " + teryt);
                console.error(err);
            });
    };

    const style = {
        fillColor: "#3498db",
        weight: 1,
        opacity: 1,
        color: '#fff',
        fillOpacity: 0.2
    };

    const highlightFeature = (e) => {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#2980b9',
            fillOpacity: 0.5
        });
        layer.bringToFront();
    };

    const resetHighlight = (e) => {
        const layer = e.target;
        layer.setStyle(style);
    };

    return (
        <MapContainer
            center={[52.13, 19.48]}
            zoom={6}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {geoData && (
                <GeoJSON
                    data={geoData}
                    style={style}
                    onEachFeature={(feature, layer) => {
                        layer.on({
                            click: onCountyClick,
                            mouseover: highlightFeature,
                            mouseout: resetHighlight
                        });
                    }}
                />
            )}
        </MapContainer>
    );
};

export default MapComponent;