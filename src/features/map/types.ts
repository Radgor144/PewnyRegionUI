import type { Feature, FeatureCollection, Geometry, MultiLineString } from 'geojson';
import type { CountyProperties, ScoreRange, ScoresLookup } from 'types/county';

export type CountyFeature = Feature<Geometry, CountyProperties>;
export type CountyFeatureCollection = FeatureCollection<Geometry, CountyProperties>;
export type PolandOutlineFeature = Feature<MultiLineString>;

export interface CountyGeoData {
    counties: CountyFeatureCollection;
    polandOutline: PolandOutlineFeature;
}

export type { CountyProperties, ScoreRange, ScoresLookup };
