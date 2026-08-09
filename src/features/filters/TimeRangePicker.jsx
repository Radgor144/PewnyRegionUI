import React from 'react';

export const TimeRangePicker = ({ yearFrom, setYearFrom, yearTo, setYearTo }) => {
    const minYear = 2012;
    const maxYear = 2025;

    const handleMinChange = (e) => {
        const value = Number(e.target.value);
        if (value > yearTo) {
            setYearFrom(yearTo);
            setYearTo(value);
        } else {
            setYearFrom(value);
        }
    };

    const handleMaxChange = (e) => {
        const value = Number(e.target.value);
        if (value < yearFrom) {
            setYearTo(yearFrom);
            setYearFrom(value);
        } else {
            setYearTo(value);
        }
    };

    const handleTrackClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = Math.max(0, Math.min(1, clickX / width));
        const clickedYear = Math.round(minYear + percentage * (maxYear - minYear));

        const distFromMin = Math.abs(clickedYear - yearFrom);
        const distFromMax = Math.abs(clickedYear - yearTo);

        if (distFromMin < distFromMax) {
            setYearFrom(clickedYear);
        } else if (distFromMax < distFromMin) {
            setYearTo(clickedYear);
        } else {
            if (clickedYear > yearFrom) {
                setYearTo(clickedYear);
            } else {
                setYearFrom(clickedYear);
            }
        }
    };

    return (
        <div style={{ marginBottom: '28px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <style>{`
                .dual-range-slider {
                    position: relative;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                }
                .dual-range-slider input[type=range] {
                    position: absolute;
                    width: 100%;
                    appearance: none;
                    background: none;
                    pointer-events: none;
                    margin: 0;
                }
                .dual-range-slider input[type=range]::-webkit-slider-thumb {
                    pointer-events: auto;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    border: 2px solid #ffffff;
                }
                .dual-range-slider input[type=range]::-moz-range-thumb {
                    pointer-events: auto;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    border: 2px solid #ffffff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }
            `}</style>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Zakres Czasu
                </span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>
                    {yearFrom === yearTo ? yearFrom : `${yearFrom} — ${yearTo}`}
                </span>
            </div>

            <div className="dual-range-slider" onClick={handleTrackClick}>
                <div style={{ position: 'absolute', width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px' }}></div>
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    value={yearFrom}
                    onChange={handleMinChange}
                    style={{ zIndex: 3 }}
                />
                <input
                    type="range"
                    min={minYear}
                    max={maxYear}
                    value={yearTo}
                    onChange={handleMaxChange}
                    style={{ zIndex: 4 }}
                />
            </div>
        </div>
    );
};