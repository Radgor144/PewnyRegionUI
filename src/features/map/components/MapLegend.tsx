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
        <div className="bg-white/90 dark:bg-panel-dark/90 backdrop-blur-md px-3 py-2 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300">
            <div className="flex justify-between items-center mb-1 font-medium">
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {t('map.score') || 'Score'}
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                    ({Math.round(scoreRange.min)}–{Math.round(scoreRange.max)})
                </span>
            </div>
            <div
                className="h-2.5 w-40 rounded-full mb-1 border border-slate-200/50 dark:border-slate-700/50"
                style={{ background: `linear-gradient(to right, ${gradientSteps})` }}
            />
            <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>{Math.round(scoreRange.min)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.25)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.5)}</span>
                <span>{Math.round(scoreRange.min + (scoreRange.max - scoreRange.min) * 0.75)}</span>
                <span>{Math.round(scoreRange.max)}</span>
            </div>
        </div>
    );
};