import React, { useEffect, useState } from 'react';
import { TimeRangePicker } from './TimeRangePicker';
import { FilterList } from './FilterList';

export const FiltersPanel = ({ selectedVariables, onVariableToggle, onScoresUpdate, isOpen, setIsOpen }) => {
    const [variables, setVariables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const [yearFrom, setYearFrom] = useState(2012);
    const [yearTo, setYearTo] = useState(2013);

    const MAX_SELECTION = 10;

    useEffect(() => {
        fetch('http://localhost:8080/api/variables')
            .then(res => {
                if (!res.ok) throw new Error(`Błąd (Status: ${res.status})`);
                return res.json();
            })
            .then(data => {
                setVariables(data);
                setLoading(false);
            })
            .catch(err => {
                setError("Nie udało się pobrać filtrów.");
                setLoading(false);
            });
    }, []);

    const handleGenerateMap = () => {
        if (selectedVariables.length === 0) return;

        setIsGenerating(true);

        const payload = {
            apiNames: selectedVariables.map(v => v.apiName),
            yearFrom: yearFrom,
            yearTo: yearTo
        };

        fetch('http://localhost:8080/api/map/county-scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("Błąd podczas generowania wyników");
                return res.json();
            })
            .then(data => {
                onScoresUpdate(data);
                setIsGenerating(false);
            })
            .catch(err => {
                alert("Nie udało się pobrać danych dla mapy.");
                setIsGenerating(false);
            });
    };

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 1000,
            pointerEvents: 'none'
        }}>
            <div style={{
                pointerEvents: 'auto',
                width: isOpen ? '320px' : '64px',
                height: '100vh',
                backgroundColor: '#ffffff',
                boxShadow: '4px 0 24px rgba(0,0,0,0.08)',
                borderRight: '1px solid #e5e7eb',
                transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {!isOpen && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        paddingTop: '24px',
                        gap: '20px',
                        width: '64px',
                        flexShrink: 0
                    }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 2px 4px rgba(37,99,235,0.3)' }}>PR</div>
                        <div style={{ width: '100%', height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />
                        <div title="Filtry i Zmienne" style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>FIL</div>
                        <div title="Zakres Czasu" style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>CZAS</div>
                        <div title="Analityka i Eksport" style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>ANA</div>
                    </div>
                )}

                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '320px',
                    height: '100%',
                    padding: '24px 24px 32px 24px',
                    boxSizing: 'border-box',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.2s ease'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '15px', boxShadow: '0 2px 6px rgba(37,99,235,0.3)' }}>PR</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.01em' }}>Pewny Region</h1>
                            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Platforma Analityczna Regionów</span>
                        </div>
                    </div>

                    <TimeRangePicker
                        yearFrom={yearFrom}
                        setYearFrom={setYearFrom}
                        yearTo={yearTo}
                        setYearTo={setYearTo}
                    />

                    <div style={{ marginBottom: '16px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, fontSize: '13px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>
                                Dostępne Filtry
                            </h3>
                            <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '10px' }}>
                                {selectedVariables.length} / {MAX_SELECTION}
                            </span>
                        </div>
                    </div>

                    {loading && <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>Ładowanie danych...</p>}
                    {error && <div style={{ color: '#ef4444', textAlign: 'center', fontSize: '14px', padding: '12px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>{error}</div>}

                    {!loading && !error && (
                        <FilterList
                            variables={variables}
                            selectedVariables={selectedVariables}
                            onVariableToggle={onVariableToggle}
                            maxSelection={MAX_SELECTION}
                        />
                    )}

                    <button
                        onClick={handleGenerateMap}
                        disabled={isGenerating || selectedVariables.length === 0}
                        style={{
                            padding: '14px',
                            backgroundColor: (isGenerating || selectedVariables.length === 0) ? '#cbd5e1' : '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: (isGenerating || selectedVariables.length === 0) ? 'not-allowed' : 'pointer',
                            marginTop: 'auto',
                            transition: 'background-color 0.2s, box-shadow 0.2s',
                            boxShadow: (isGenerating || selectedVariables.length === 0) ? 'none' : '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        {isGenerating ? "Obliczanie..." : "Generuj Mapę"}
                    </button>
                </div>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    pointerEvents: 'auto',
                    position: 'absolute',
                    top: '50%',
                    left: isOpen ? '300px' : '44px',
                    transform: 'translateY(-50%)',
                    zIndex: 1100,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 8px -1px rgba(0, 0, 0, 0.12)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#334155',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                {isOpen ? '‹' : '›'}
            </button>
        </div>
    );
};