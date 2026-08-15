
export interface CountyProperties {
    nazwa?: string;
    JPT_NAZWA_?: string;
    teryt?: string;
    JPT_KOD_JE?: string;
    [key: string]: unknown;
}

export interface ScoreRange {
    min: number;
    max: number;
}

export type ScoresLookup = Record<string, number>;