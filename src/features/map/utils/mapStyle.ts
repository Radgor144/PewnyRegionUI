import L, { PathOptions } from 'leaflet';
import { getTeryt } from './teryt';
import { getScoreColor } from './colorScale';
import type { CountyFeature, ScoreRange, ScoresLookup } from 'features/map/types';
import { COLOR_F8FAFC, COLOR_0F172A, COLOR_1E293B, COLOR_020617, COLOR_CBD5E1, COLOR_FFFFFF } from 'lib/colors';

export const HIGHLIGHT_WEIGHT = 2;
export const bringToFront = (layer: L.Path) => {
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
};

export const applyHighlightStyle = (layer: L.Path, isDark: boolean) => {
    layer.setStyle({
        weight: HIGHLIGHT_WEIGHT,
        color: isDark ? COLOR_F8FAFC : COLOR_0F172A,
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
            color: isDark ? COLOR_1E293B : COLOR_CBD5E1,
            weight: 0.8,
            fillColor: isDark ? COLOR_020617 : COLOR_F8FAFC,
            fillOpacity: isDark ? 0.5 : 0.6,
        };

        if (!feature) return noDataStyle;

        const teryt = getTeryt(feature.properties);
        const score = teryt && scoresMap ? scoresMap[teryt] : undefined;

        if (score == null) return noDataStyle;

        return {
            color: isDark ? COLOR_0F172A : COLOR_FFFFFF,
            weight: isDark ? 1 : 0.8,
            fillColor: getScoreColor(score, scoreRange),
            fillOpacity: isDark ? 0.85 : 0.9,
        };
    };
};