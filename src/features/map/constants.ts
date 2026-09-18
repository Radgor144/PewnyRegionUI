import type { ScoreRange } from './types';

export const GEOJSON_URL = '/data/powiaty.geojson';

export const POLAND_CENTER: [number, number] = [52.13, 19.48];
export const DEFAULT_ZOOM = 6;
export const SEARCH_FIT_MAX_ZOOM = 7;
export const SEARCH_RESULTS_LIMIT = 5;

export const TILE_URLS = {
    light: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
    dark: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
} as const;

export const TILE_ATTRIBUTION = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ';

export const DEFAULT_SCORE_RANGE: ScoreRange = { min: 0, max: 100 };