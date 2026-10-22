import L, { PathOptions } from 'leaflet';
import { getTeryt } from './teryt';
import { getScoreColor } from './colorScale';
import type { CountyFeature, ScoreRange, ScoresLookup } from 'features/map/types';

export const HIGHLIGHT_WEIGHT = 2;
export const bringToFront = (layer: L.Path) => {
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

export const applyHighlightStyle = (layer: L.Path, isDark: boolean) => {
    layer.setStyle({
        stroke: true,
        weight: HIGHLIGHT_WEIGHT,
        color: isDark ? '#f8fafc' : '#0f172a',
        fillOpacity: 1,
    });
    bringToFront(layer);
};

export const createFeatureStyleFactory = (
    scoreRange: ScoreRange,
    scoresMap?: ScoresLookup | null
) => {
    return (feature?: CountyFeature): PathOptions => {
        const noDataStyle: PathOptions = {
            stroke: true,
            color: 'var(--color-map-no-data-border)',
            opacity: 0.8,
            weight: 0.75,
            fill: true,
            fillOpacity: 0,
            lineJoin: 'round',
            lineCap: 'round',
        };

        if (!feature) return noDataStyle;

        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        if (score == null) return noDataStyle;

        const fillCol = getScoreColor(score, scoreRange);
        return {
            stroke: true,
            color: fillCol,
            opacity: 1,
            weight: 1,
            fill: true,
            fillColor: fillCol,
            fillOpacity: 0.95,
            lineJoin: 'round',
            lineCap: 'round',
        };
    };
};