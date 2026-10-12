import type { ScoreRange } from 'features/map/types';

interface ColorThreshold {
    readonly maxRatio: number;
    readonly color: string;
}

const THRESHOLDS: readonly ColorThreshold[] = [
    { maxRatio: 0.20, color: 'hsl(40, 75%, 78%)' },
    { maxRatio: 0.40, color: 'hsl(32, 65%, 62%)' },
    { maxRatio: 0.60, color: 'hsl(20, 55%, 50%)' },
    { maxRatio: 0.80, color: 'hsl(0, 60%, 42%)' },
    { maxRatio: 1.00, color: 'hsl(346, 65%, 34%)' },
];

const FALLBACK_COLOR = 'hsl(30, 10%, 82%)';

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

export const getScoreColor = (score: number, range: ScoreRange): string => {
    if (range.max === range.min) return FALLBACK_COLOR;

    const ratio = clamp01((score - range.min) / (range.max - range.min));
    const threshold = THRESHOLDS.find((t) => ratio <= t.maxRatio);

    return threshold ? threshold.color : THRESHOLDS[THRESHOLDS.length - 1].color;
};