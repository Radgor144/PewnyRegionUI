export type Direction = 'STIMULANT' | 'DESTIMULANT';

export type VariableCategory =
    | 'SAFETY'
    | 'HEALTH'
    | 'TRANSPORT'
    | 'POPULATION'
    | 'LABOR'
    | 'HOUSING'
    | 'FINANCE'
    | 'OTHER';

export interface Variable {
    apiName: string;
    category: VariableCategory;
    bdlIds: number[];
    direction: Direction;
    per_capita: boolean;
    unit: string;
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
    apiName: string;
    yearlyValues: YearlyData[];
}

export interface CountyDetailsResponse {
    terytCode: string;
    variables: VariableDetail[];
}