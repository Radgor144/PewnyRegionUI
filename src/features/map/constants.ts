import type { ScoreRange } from './types';

export const GEOJSON_URL = '/data/powiaty.geojson';

export const POLAND_CENTER: [number, number] = [52.13, 19.48];
export const DEFAULT_ZOOM = 6;
export const SEARCH_FIT_MAX_ZOOM = 7;
export const SEARCH_RESULTS_LIMIT = 5;
export const MAP_INVALIDATE_DELAY_MS = 300;

export const TILE_URLS = {
    light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
} as const;

export const TILE_ATTRIBUTION = '&copy; <a href="https://carto.com/">CARTO</a>';

export const DEFAULT_SCORE_RANGE: ScoreRange = { min: 0, max: 100 };