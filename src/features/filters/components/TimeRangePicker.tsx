import type { ChangeEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface TimeRangePickerProps {
    yearFrom: number;
    setYearFrom: (year: number) => void;
    yearTo: number;
    setYearTo: (year: number) => void;
}

const MIN_YEAR = 2012;
const MAX_YEAR = 2025;
const RANGE = MAX_YEAR - MIN_YEAR;

export const TimeRangePicker = ({
                                    yearFrom,
                                    setYearFrom,
                                    yearTo,
                                    setYearTo,
                                }: TimeRangePickerProps) => {
    const { t } = useTranslation();

    const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > yearTo) {
            setYearFrom(yearTo);
            setYearTo(value);
        } else {
            setYearFrom(value);
        }
    };

    const handleMaxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value < yearFrom) {
            setYearTo(yearFrom);
            setYearFrom(value);
        } else {
            setYearTo(value);
        }
    };

    const handleTrackClick = (e: MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLInputElement) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const clickedYear = Math.round(MIN_YEAR + percentage * RANGE);

        const distFromMin = Math.abs(clickedYear - yearFrom);
        const distFromMax = Math.abs(clickedYear - yearTo);

        if (distFromMin < distFromMax) {
            setYearFrom(clickedYear);
        } else if (distFromMax < distFromMin) {
            setYearTo(clickedYear);
        } else if (clickedYear > yearFrom) {
            setYearTo(clickedYear);
        } else {
            setYearFrom(clickedYear);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'var(--color-text)' }}
                >
                    {t('filters.timeRange')}
                </span>
                <span className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>
                    {yearFrom === yearTo ? yearFrom : `${yearFrom} - ${yearTo}`}
                </span>
            </div>

            <div className="dual-range-slider mt-1" onClick={handleTrackClick}>
                <div
                    className="absolute h-1 w-full rounded-full"
                    style={{ backgroundColor: 'var(--color-chart-grid)' }}
                />
                <div
                    className="pointer-events-none absolute z-[5] h-1 rounded-full"
                    style={{
                        backgroundColor: 'var(--color-chart-stroke-primary)',
                        left: `${((yearFrom - MIN_YEAR) / RANGE) * 100}%`,
                        width: `${((yearTo - yearFrom) / RANGE) * 100}%`,
                    }}
                />
                <input
                    type="range"
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearFrom}
                    onChange={handleMinChange}
                    aria-label={t('filters.yearFrom')}
                    className="z-10"
                />
                <input
                    type="range"
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearTo}
                    onChange={handleMaxChange}
                    aria-label={t('filters.yearTo')}
                    className="z-20"
                />
            </div>

            <div
                className="flex justify-between text-[9px] font-semibold"
                style={{ color: 'var(--color-text-muted)' }}
            >
                <span>{MIN_YEAR}</span>
                <span>{MAX_YEAR}</span>
            </div>
        </div>
    );
};