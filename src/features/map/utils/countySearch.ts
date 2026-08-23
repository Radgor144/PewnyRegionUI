import type { CountyFeature } from '../types';

export const getCountyName = (feature: CountyFeature): string =>
    feature.properties.nazwa ?? feature.properties.JPT_NAZWA_ ?? '';

export const normalizeText = (text: string): string =>
    text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export const matchesQuery = (feature: CountyFeature, query: string): boolean =>
    normalizeText(getCountyName(feature)).includes(normalizeText(query));