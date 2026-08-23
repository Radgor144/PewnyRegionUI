import type { Feature, FeatureCollection, Geometry } from 'geojson';

export interface CountyProperties {
    JPT_KOD_JE?: string;
    teryt?: string;
    JPT_NAZWA_?: string;
    nazwa?: string;
    podpowiedz?: string;
}

export type CountyFeature = Feature<Geometry, CountyProperties>;
export type CountyFeatureCollection = FeatureCollection<Geometry, CountyProperties>;

export interface ScoreRange {
    min: number;
    max: number;
}

export type ScoresLookup = Record<string, number>;