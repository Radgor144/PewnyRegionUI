import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTheme } from '../../context/ThemeContext';
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
    const { theme } = useTheme();
    const [geoData, setGeoData] = useState(null);
    const geoJsonRef = useRef(null);

    const tileUrl = theme === 'dark'
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

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
        return { min: Math.min(...scores), max: Math.max(...scores) };
    }, [scoresData]);

    const getFeatureStyle = (feature) => {
        const isDark = theme === 'dark';
        const defaultStyle = {
            color: isDark ? '#334155' : '#cbd5e1',
            weight: 0.8,
            fillOpacity: 0.8,
            fillColor: isDark ? '#1e293b' : '#e2e8f0'
        };

        if (!scoresMap) return defaultStyle;

        const teryt = feature.properties.JPT_KOD_JE || feature.properties.teryt;
        const score = scoresMap[teryt];

        if (score == null) {
            return {
                color: isDark ? '#1e293b' : '#cbd5e1',
                weight: 0.6,
                fillColor: isDark ? '#0f172a' : '#f8fafc',
                fillOpacity: 0.6
            };
        }

        const ratio = minMax.max === minMax.min ? 1 : (score - minMax.min) / (minMax.max - minMax.min);
        const hue = ratio * 120;

        const fillColor = isDark
            ? `hsl(${hue}, 75%, 46%)`
            : `hsl(${hue}, 85%, 45%)`;

        const borderColor = isDark ? '#1e293b' : '#ffffff';
        const fillOpacity = isDark ? 0.75 : 0.9;
        const strokeWeight = 0.8;

        return { color: borderColor, weight: strokeWeight, fillColor, fillOpacity };
    };

    const highlightFeature = (e) => {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: theme === 'dark' ? '#ffffff' : '#0f172a',
            fillOpacity: theme === 'dark' ? 0.9 : 1
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        layer.openTooltip();
    };

    const resetHighlight = (e) => {
        const layer = e.target;
        if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(layer);
        }
        layer.closeTooltip();
    };

    const geoJsonKey = useMemo(() => {
        return scoresMap ? `${theme}-${JSON.stringify(scoresMap)}` : `${theme}-empty`;
    }, [scoresMap, theme]);

    return (
        <div className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-950">
            <MapContainer center={[52.13, 19.48]} zoom={6} className="h-full w-full" zoomControl={false}>
                <MapInvalidator isOpen={isOpen} />
                <TileLayer
                    url={tileUrl}
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                {geoData && (
                    <GeoJSON
                        key={geoJsonKey}
                        ref={geoJsonRef}
                        data={geoData}
                        style={(feature) => getFeatureStyle(feature)}
                        onEachFeature={(feature, layer) => {
                            const teryt = feature.properties.JPT_KOD_JE || feature.properties.teryt;
                            const score = scoresMap ? scoresMap[teryt] : null;
                            const countyName = feature.properties.JPT_NAZWA_ || feature.properties.nazwa || 'County';

                            const scoreHtml = score != null
                                ? `<div class="mt-1 text-blue-600 dark:text-blue-400 font-bold text-sm">Score: ${score.toFixed(2)}</div>`
                                : `<div class="mt-1 text-slate-400 text-xs font-medium">Brak danych</div>`;

                            layer.bindTooltip(
                                `<div class="text-center min-w-[90px]">
                                    <strong class="text-slate-900 text-[13px]">${countyName}</strong>
                                    ${scoreHtml}
                                </div>`,
                                { className: 'custom-tooltip', direction: 'top', sticky: true, permanent: false }
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