import { useTranslation } from 'react-i18next';

interface TimeRangePickerProps {
    yearFrom: number;
    setYearFrom: (year: number) => void;
    yearTo: number;
    setYearTo: (year: number) => void;
}

const MIN_YEAR = 2012;
const MAX_YEAR = 2025;

export const TimeRangePicker = ({ yearFrom, setYearFrom, yearTo, setYearTo }: TimeRangePickerProps) => {
    const { t } = useTranslation();

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value > yearTo) { setYearFrom(yearTo); setYearTo(value); } else { setYearFrom(value); }
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (value < yearFrom) { setYearTo(yearFrom); setYearFrom(value); } else { setYearTo(value); }
    };

    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const clickedYear = Math.round(MIN_YEAR + percentage * (MAX_YEAR - MIN_YEAR));
        const distFromMin = Math.abs(clickedYear - yearFrom);
        const distFromMax = Math.abs(clickedYear - yearTo);

        if (distFromMin < distFromMax) setYearFrom(clickedYear);
        else if (distFromMax < distFromMin) setYearTo(clickedYear);
        else clickedYear > yearFrom ? setYearTo(clickedYear) : setYearFrom(clickedYear);
    };

    return (
        <div className="bg-slate-100/70 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/50 transition-colors">
            <style>{`
                .dual-range-slider { position: relative; height: 24px; display: flex; align-items: center; cursor: pointer; }
                .dual-range-slider input[type=range] { position: absolute; width: 100%; appearance: none; background: none; pointer-events: none; margin: 0; }
                .dual-range-slider input[type=range]::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #2563eb; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
                .dual-range-slider input[type=range]::-moz-range-thumb { pointer-events: auto; width: 16px; height: 16px; border-radius: 50%; background: #2563eb; cursor: pointer; border: 2px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3); }
            `}</style>

            <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {t('filters.timeRange')}
                </span>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-100/80 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200/60 dark:border-blue-900/50">
                    {yearFrom === yearTo ? yearFrom : `${yearFrom} — ${yearTo}`}
                </span>
            </div>

            <div className="dual-range-slider" onClick={handleTrackClick}>
                <div className="absolute w-full h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearFrom} onChange={handleMinChange} className="z-10" />
                <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearTo} onChange={handleMaxChange} className="z-20" />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-semibold mt-3">
                <span>{MIN_YEAR}</span>
                <span>{MAX_YEAR}</span>
            </div>
        </div>
    );
};