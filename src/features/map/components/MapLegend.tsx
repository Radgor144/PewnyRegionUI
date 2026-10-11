import { useTranslation } from 'react-i18next';
import { getScoreColor } from '../utils/colorScale';
import type { ScoreRange } from '../types';

interface MapLegendProps {
    scoreRange: ScoreRange;
}

export const MapLegend = ({ scoreRange }: MapLegendProps) => {
    const { t } = useTranslation();

    const gradientSteps = [0, 0.25, 0.5, 0.75, 1]
        .map((ratio) => {
            const val = scoreRange.min + ratio * (scoreRange.max - scoreRange.min);
            return getScoreColor(val, scoreRange);
        })
        .join(', ');

    return (
        <div
            className="backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border text-[11px]"
            style={{
                backgroundColor: 'var(--color-tooltip-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
            }}
        >
            <div className="flex justify-between items-center mb-1 font-medium">
                <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {t('map.score') || 'Score'}
                </span>
                <span style={{ color: 'var(--color-text-muted)' }}>
                    ({Math.round(scoreRange.min)}–{Math.round(scoreRange.max)})
                </span>
            </div>
            <div
                className="h-2.5 w-40 rounded-full mb-1 border"
                style={{
                    background: `linear-gradient(to right, ${gradientSteps})`,
                    borderColor: 'var(--color-border)',
                }}
            />
            <div className="flex justify-between text-[9px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                <span>{Math.round(scoreRange.min)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.25)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.5)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.75)}</span>
                <span>{Math.round(scoreRange.max)}</span>
            </div>
        </div>
    );
};