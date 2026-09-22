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

export interface YearlyData {
    year: number;
    rawValue: number;
    normalizedScore?: number;
    averageScore: number;
}

export interface VariableDetail {
    bdlVariableId: number;
    yearlyValues: YearlyData[];
}

export interface CountyDetailsResponse {
    terytCode: string;
    variables: VariableDetail[];
}