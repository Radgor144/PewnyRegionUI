import { useTranslation } from 'react-i18next';
import { BRAND_BLUE, COLOR_FFFFFF } from 'lib/colors';

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
        <div className="flex flex-col gap-2">
            <style>{`
                .dual-range-slider { position: relative; height: 18px; display: flex; align-items: center; cursor: pointer; }
                .dual-range-slider input[type=range] { position: absolute; width: 100%; appearance: none; background: none; pointer-events: none; margin: 0; }
                .dual-range-slider input[type=range]::-webkit-slider-thumb { pointer-events: auto; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: ${BRAND_BLUE}; cursor: pointer; border: 2px solid ${COLOR_FFFFFF}; box-shadow: 0 1px 2px rgba(0,0,0,0.28); }
                .dual-range-slider input[type=range]::-moz-range-thumb { pointer-events: auto; width: 12px; height: 12px; border-radius: 50%; background: ${BRAND_BLUE}; cursor: pointer; border: 2px solid ${COLOR_FFFFFF}; box-shadow: 0 1px 2px rgba(0,0,0,0.28); }
            `}</style>

            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                    {t('filters.timeRange')}
                </span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    {yearFrom === yearTo ? yearFrom : `${yearFrom} - ${yearTo}`}
                </span>
            </div>

            <div className="dual-range-slider mt-1" onClick={handleTrackClick}>
                <div className="absolute w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearFrom} onChange={handleMinChange} className="z-10" />
                <input type="range" min={MIN_YEAR} max={MAX_YEAR} value={yearTo} onChange={handleMaxChange} className="z-20" />
            </div>

            <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-semibold">
                <span>{MIN_YEAR}</span>
                <span>{MAX_YEAR}</span>
            </div>
        </div>
    );
};