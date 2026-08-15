export type Direction = 'STIMULANT' | 'DESTIMULANT';

export interface Variable {
    apiName: string;
    bdlIds: number[];
    direction: Direction;
    per_capita: boolean;
}

export interface CountyScore {
    countyId: string;
    score: number;
}