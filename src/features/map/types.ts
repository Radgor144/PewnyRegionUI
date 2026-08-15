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

/** Maps a 4-digit county TERYT code to its score value. */
export type ScoresLookup = Record<string, number>;

export interface ScoreRange {
    min: number;
    max: number;
}