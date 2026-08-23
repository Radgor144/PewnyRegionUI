import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { CountyProperties, ScoreRange, ScoresLookup } from 'types/county';

export type CountyFeature = Feature<Geometry, CountyProperties>;
export type CountyFeatureCollection = FeatureCollection<Geometry, CountyProperties>;

export type { CountyProperties, ScoreRange, ScoresLookup };
