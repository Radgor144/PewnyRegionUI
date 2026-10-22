import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout, MainSidebar } from '../components/Layout';
import { FiltersPanel } from '../features/filters';
import { RegionMap, CountyDetailsPanel } from '../features/map';
import type { CountyFeature } from '../features/map';
import type { CountyScore, Variable } from '../types/api';

const ComingSoonPage = ({ title }: { title: string }) => {
    const { t } = useTranslation();

    return (
        <main className="flex h-full items-center justify-center px-6 text-center">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {t('pages.comingSoon')}
                </p>
            </div>
        </main>
    );
};

export function App() {
    const { t } = useTranslation();
    const { pathname } = useLocation();
    const [scoresData, setScoresData] = useState<CountyScore[] | null>(null);
    const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState<boolean>(true);
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
    const [selectedCounty, setSelectedCounty] = useState<CountyFeature | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
    const isMapView = pathname === '/map';

    const handleCountySelect = (feature: CountyFeature) => {
        setSelectedCounty(feature);
        setIsDetailsOpen(true);
    };

    return (
        <DashboardLayout
            sidebar={
                <MainSidebar
                    isOpen={isMainSidebarOpen}
                    toggleOpen={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
                />
            }
            content={
                <Routes>
                    <Route
                        path="/map"
                        element={
                            <RegionMap
                                scoresData={scoresData}
                                isOpen={isFiltersOpen}
                                onCountySelect={handleCountySelect}
                            />
                        }
                    />
                    <Route path="/counties" element={<ComingSoonPage title={t('sidebar.counties')} />} />
                    <Route path="/rankings" element={<ComingSoonPage title={t('sidebar.rankings')} />} />
                    <Route path="/" element={<Navigate to="/map" replace />} />
                    <Route path="*" element={<Navigate to="/map" replace />} />
                </Routes>
            }
            filters={isMapView ? (
                <FiltersPanel
                    selectedVariables={selectedVariables}
                    onVariableToggle={setSelectedVariables}
                    onScoresUpdate={setScoresData}
                    hasScores={scoresData !== null}
                    isOpen={isFiltersOpen}
                    setIsOpen={setIsFiltersOpen}
                    isMainSidebarOpen={isMainSidebarOpen}
                />
            ) : null}
            details={isMapView ? (
                <CountyDetailsPanel
                    county={selectedCounty}
                    isOpen={isDetailsOpen}
                    setIsOpen={setIsDetailsOpen}
                    selectedVariables={selectedVariables}
                />
            ) : null}
        />
    );
}

export default App;
