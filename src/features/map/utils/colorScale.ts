interface ScoreRange {
    min: number;
    max: number;
}

interface ColorStop {
    readonly ratio: number;
    readonly hue: number;
    readonly saturation: number;
    readonly lightness: number;
}

const COLOR_STOPS: readonly ColorStop[] = [
    { ratio: 0.00, hue: 0,   saturation: 82, lightness: 52 },
    { ratio: 0.16, hue: 16,  saturation: 88, lightness: 52 },
    { ratio: 0.33, hue: 34,  saturation: 92, lightness: 50 },
    { ratio: 0.50, hue: 48,  saturation: 95, lightness: 48 },
    { ratio: 0.67, hue: 82,  saturation: 68, lightness: 45 },
    { ratio: 0.84, hue: 125, saturation: 62, lightness: 40 },
    { ratio: 1.00, hue: 148, saturation: 78, lightness: 36 },
];

const FALLBACK_COLOR = 'hsl(48, 95%, 48%)';

const clamp01 = (value: number): number => Math.max(0, Math.min(1, value));

const lerp = (start: number, end: number, factor: number): number =>
    start + factor * (end - start);

const findSurroundingStops = (ratio: number): [ColorStop, ColorStop] => {
    for (let i = 0; i < COLOR_STOPS.length - 1; i += 1) {
        const current = COLOR_STOPS[i];
        const next = COLOR_STOPS[i + 1];
        if (ratio >= current.ratio && ratio <= next.ratio) {
            return [current, next];
        }
    }
    return [COLOR_STOPS[0], COLOR_STOPS[COLOR_STOPS.length - 1]];
};

export const getScoreColor = (score: number, range: ScoreRange): string => {
    if (range.max === range.min) return FALLBACK_COLOR;

    const ratio = clamp01((score - range.min) / (range.max - range.min));
    const [lower, upper] = findSurroundingStops(ratio);

    const span = upper.ratio - lower.ratio;
    const factor = span === 0 ? 0 : (ratio - lower.ratio) / span;

    const hue = Math.round(lerp(lower.hue, upper.hue, factor));
    const saturation = Math.round(lerp(lower.saturation, upper.saturation, factor));
    const lightness = Math.round(lerp(lower.lightness, upper.lightness, factor));

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};