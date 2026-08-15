import type { CountyProperties } from '../types';

export const getTeryt = (properties: CountyProperties): string | undefined =>
    properties.JPT_KOD_JE ?? properties.teryt;

export const terytFromCountyId = (countyId: string): string =>
    countyId.substring(2, 4) + countyId.substring(7, 9);

export const isValidCountyId = (countyId: string | undefined): countyId is string =>
    typeof countyId === 'string' && countyId.length === 12;