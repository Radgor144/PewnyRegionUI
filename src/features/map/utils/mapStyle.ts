import L, { PathOptions } from 'leaflet';
import { getTeryt } from './teryt';
import { getScoreColor } from './colorScale';
import type { CountyFeature, ScoreRange, ScoresLookup } from '../types';

export const HIGHLIGHT_WEIGHT = 2;
export const bringToFront = (layer: L.Path) => {
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

export const applyHighlightStyle = (layer: L.Path, isDark: boolean) => {
    layer.setStyle({
        weight: HIGHLIGHT_WEIGHT,
        color: isDark ? '#f8fafc' : '#0f172a',
        fillOpacity: 1,
    });
    bringToFront(layer);
};

export const createFeatureStyleFactory = (
    isDark: boolean,
    scoreRange: ScoreRange,
    scoresMap?: ScoresLookup | null
) => {
    return (feature?: CountyFeature): PathOptions => {
        const noDataStyle: PathOptions = {
            color: isDark ? '#1e293b' : '#cbd5e1',
            weight: 0.8,
            fillColor: isDark ? '#020617' : '#f8fafc',
            fillOpacity: isDark ? 0.5 : 0.6,
        };

        if (!feature) return noDataStyle;

        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        if (score == null) return noDataStyle;

        return {
            color: isDark ? '#0f172a' : '#ffffff',
            weight: isDark ? 1 : 0.8,
            fillColor: getScoreColor(score, scoreRange),
            fillOpacity: isDark ? 0.85 : 0.9,
        };
    };
};