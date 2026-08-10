import { useEffect, useMemo, useRef, useState } from 'react';
import { GeoJSON, MapContainer, TileLayer, useMap } from 'react-leaflet';
import L, { Layer, LeafletMouseEvent, PathOptions } from 'leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { useTheme } from 'context/ThemeContext';
import { CountyScore } from 'api/types';
import 'leaflet/dist/leaflet.css';

interface CountyProperties {
    JPT_KOD_JE?: string;
    teryt?: string;
    JPT_NAZWA_?: string;
    nazwa?: string;
}

type CountyFeature = Feature<Geometry, CountyProperties>;
type CountyFeatureCollection = FeatureCollection<Geometry, CountyProperties>;
type ScoresLookup = Record<string, number>;

interface MapInvalidatorProps {
    isOpen: boolean;
}

const MapInvalidator = ({ isOpen }: MapInvalidatorProps) => {
    const map = useMap();
    useEffect(() => {
        const timer = setTimeout(() => {
            map.invalidateSize();
        }, 300);
        return () => clearTimeout(timer);
    }, [isOpen, map]);
    return null;
};

interface RegionMapProps {
    scoresData: CountyScore[] | null;
    isOpen: boolean;
}

const getTeryt = (properties: CountyProperties): string | undefined =>
    properties.JPT_KOD_JE || properties.teryt;

export const RegionMap = ({ scoresData, isOpen }: RegionMapProps) => {
    const { theme } = useTheme();
    const [geoData, setGeoData] = useState<CountyFeatureCollection | null>(null);
    const geoJsonRef = useRef<L.GeoJSON | null>(null);

    const tileUrl = theme === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    useEffect(() => {
        fetch('/data/powiaty.geojson')
            .then(res => res.json())
            .then((data: CountyFeatureCollection) => {
                const countiesOnly: CountyFeatureCollection = {
                    ...data,
                    features: data.features.filter(f => {
                        const kod = getTeryt(f.properties as CountyProperties);
                        return kod && kod.length === 4;
                    }),
                };
                setGeoData(countiesOnly);
            });
    }, []);

    const scoresMap = useMemo<ScoresLookup | null>(() => {
        if (!scoresData) return null;
        const map: ScoresLookup = {};
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

    const getFeatureStyle = (feature?: CountyFeature): PathOptions => {
        const isDark = theme === 'dark';
        const defaultStyle: PathOptions = {
            color: isDark ? '#1e293b' : '#cbd5e1',
            weight: 0.8,
            fillOpacity: 0.8,
            fillColor: isDark ? '#0f172a' : '#e2e8f0',
        };

        if (!scoresMap || !feature) return defaultStyle;

        const teryt = getTeryt(feature.properties);
        const score = teryt ? scoresMap[teryt] : undefined;

        if (score == null) {
            return {
                color: isDark ? '#1e293b' : '#cbd5e1',
                weight: 0.8,
                fillColor: isDark ? '#020617' : '#f8fafc',
                fillOpacity: isDark ? 0.5 : 0.6,
            };
        }

        const ratio = minMax.max === minMax.min ? 1 : (score - minMax.min) / (minMax.max - minMax.min);
        const hue = ratio * 140;

        return {
            color: isDark ? '#0f172a' : '#ffffff',
            weight: isDark ? 1 : 0.8,
            fillColor: isDark ? `hsl(${hue}, 70%, 45%)` : `hsl(${hue}, 80%, 45%)`,
            fillOpacity: isDark ? 0.85 : 0.9,
        };
    };

    const highlightFeature = (e: LeafletMouseEvent) => {
        const layer = e.target as L.Path;
        layer.setStyle({
            weight: 2,
            color: theme === 'dark' ? '#f8fafc' : '#0f172a',
            fillOpacity: 1,
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            (layer as any).bringToFront();
        }

        layer.openTooltip();
    };

    const resetHighlight = (e: LeafletMouseEvent) => {
        const layer = e.target as L.Path;
        if (geoJsonRef.current) {
            geoJsonRef.current.resetStyle(layer);
        }
        layer.closeTooltip();
    };

    const geoJsonKey = useMemo(() => {
        return scoresMap ? `${theme}-${JSON.stringify(scoresMap)}` : `${theme}-empty`;
    }, [scoresMap, theme]);

    const onEachFeature = (feature: CountyFeature, layer: Layer) => {
        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;
        const countyName = feature.properties.JPT_NAZWA_ || feature.properties.nazwa || 'County';

        const scoreHtml = score != null
            ? `<div class="mt-1 text-blue-600 dark:text-blue-400 font-bold text-sm">Score: ${score.toFixed(2)}</div>`
            : `<div class="mt-1 text-slate-400 text-xs font-medium">No data</div>`;

        layer.bindTooltip(
            `<div class="text-center min-w-[90px]">
                <strong class="text-slate-900 text-[13px]">${countyName}</strong>
                ${scoreHtml}
            </div>`,
            { className: 'custom-tooltip', direction: 'top', sticky: true, permanent: false }
        );

        layer.on({
            mouseover: highlightFeature as (e: L.LeafletEvent) => void,
            mouseout: resetHighlight as (e: L.LeafletEvent) => void,
        });
    };

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
                        style={getFeatureStyle as (feature?: any) => PathOptions}
                        onEachFeature={onEachFeature as (feature: any, layer: Layer) => void}
                    />
                )}
            </MapContainer>
        </div>
    );
};