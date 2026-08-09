import React, { useEffect, useState, useMemo, useRef } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapInvalidator = ({ isOpen }) => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [isOpen, map]);
    return null;
};

export const RegionMap = ({ scoresData, isOpen }) => {
    const [geoData, setGeoData] = useState(null);
    const geoJsonRef = useRef(null);
    const activeLayerRef = useRef(null);

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

    const scoresMap = useMemo(() => {
        if (!scoresData) return null;

        const map = {};
        scoresData.forEach(item => {
            if (item.countyId && item.countyId.length === 12) {
                const teryt = item.countyId.substring(2, 4) + item.countyId.substring(7, 9);
                map[teryt] = item.score;
            }
        });
        return map;
    }, [scoresData]);

    const minMax = useMemo(() => {
        if (!scoresData || scoresData.length === 0) return { min: 0, max: 100 };
        const scores = scoresData.map(s => s.score);
        return {
            min: Math.min(...scores),
            max: Math.max(...scores)
        };
    }, [scoresData]);

    const getFeatureStyle = (feature) => {
        const defaultStyle = {
            color: '#64748b',
            weight: 1,
            fillOpacity: 0.85,
            fillColor: '#e2e8f0'
        };

        if (!scoresMap) return defaultStyle;

        const teryt = feature.properties.JPT_KOD_JE || feature.properties.teryt;
        const score = scoresMap[teryt];

        if (score == null) {
            return { color: '#94a3b8', weight: 0.8, fillColor: '#cbd5e1', fillOpacity: 0.6 };
        }

        const ratio = minMax.max === minMax.min ? 1 : (score - minMax.min) / (minMax.max - minMax.min);
        const hue = ratio * 120;

        return {
            color: '#ffffff',
            weight: 1,
            fillColor: `hsl(${hue}, 85%, 52%)`,
            fillOpacity: 0.85
        };
    };

    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.eachLayer(layer => {
                if (layer.feature) {
                    const style = getFeatureStyle(layer.feature);
                    layer._baseStyle = style;
                    layer.setStyle(style);

                    const teryt = layer.feature.properties.JPT_KOD_JE || layer.feature.properties.teryt;
                    const score = scoresMap ? scoresMap[teryt] : null;
                    const countyName = layer.feature.properties.JPT_NAZWA_ || layer.feature.properties.nazwa || 'Powiat';

                    const scoreHtml = score != null
                        ? `<div style="margin-top: 4px; color: #2563eb; font-weight: 700; font-size: 14px;">Wynik: ${score.toFixed(2)}</div>`
                        : `<div style="margin-top: 2px; color: #64748b; font-size: 11px; font-weight: 500;">Brak obliczonego wyniku</div>`;

                    layer.setTooltipContent(
                        `<div style="text-align: center; min-width: 90px; padding: 2px;">
                            <strong style="color: #1e293b; font-size: 13px;">${countyName}</strong>
                            ${scoreHtml}
                        </div>`
                    );
                }
            });
        }
    }, [scoresMap, minMax]);
    const highlightFeature = (e) => {
        const layer = e.target;

        if (activeLayerRef.current && activeLayerRef.current !== layer) {
            if (activeLayerRef.current._baseStyle) {
                activeLayerRef.current.setStyle(activeLayerRef.current._baseStyle);
            }
            if (typeof activeLayerRef.current.closeTooltip === 'function') {
                activeLayerRef.current.closeTooltip();
            }
        }

        activeLayerRef.current = layer;
        layer.setStyle({
            weight: 2.5,
            color: '#0f172a',
            fillOpacity: 0.95,
            fillColor: layer._baseStyle ? layer._baseStyle.fillColor : undefined
        });
        layer.bringToFront();
    };

    const resetHighlight = (e) => {
        const layer = e.target;
        if (activeLayerRef.current === layer) {
            activeLayerRef.current = null;
        }
        if (layer._baseStyle) {
            layer.setStyle(layer._baseStyle);
        }

        if (typeof layer.closeTooltip === 'function') {
            layer.closeTooltip();
        }
    };

    return (
        <div style={{ flexGrow: 1, position: 'relative', height: '100%', backgroundColor: '#f1f5f9' }}>
            <style>{`
                .custom-tooltip {
                    pointer-events: none !important;
                }
                .leaflet-tooltip {
                    pointer-events: none !important;
                }
            `}</style>

            <MapContainer center={[52.13, 19.48]} zoom={6} style={{ height: "100%", width: "100%" }} zoomControl={false}>
                <MapInvalidator isOpen={isOpen} />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {geoData && (
                    <GeoJSON
                        ref={geoJsonRef}
                        data={geoData}
                        style={(feature) => getFeatureStyle(feature)}
                        onEachFeature={(feature, layer) => {
                            const initialStyle = getFeatureStyle(feature);
                            layer._baseStyle = initialStyle;

                            const teryt = feature.properties.JPT_KOD_JE || feature.properties.teryt;
                            const score = scoresMap ? scoresMap[teryt] : null;
                            const countyName = feature.properties.JPT_NAZWA_ || feature.properties.nazwa || 'Powiat';

                            const scoreHtml = score != null
                                ? `<div style="margin-top: 4px; color: #2563eb; font-weight: 700; font-size: 14px;">Wynik: ${score.toFixed(2)}</div>`
                                : `<div style="margin-top: 2px; color: #64748b; font-size: 11px; font-weight: 500;">Brak obliczonego wyniku</div>`;

                            layer.bindTooltip(
                                `<div style="text-align: center; min-width: 90px; padding: 2px;">
                                    <strong style="color: #1e293b; font-size: 13px;">${countyName}</strong>
                                    ${scoreHtml}
                                </div>`,
                                { className: 'custom-tooltip', direction: 'top', sticky: true }
                            );

                            layer.on({
                                mouseover: highlightFeature,
                                mouseout: resetHighlight
                            });
                        }}
                    />
                )}
            </MapContainer>
        </div>
    );
};