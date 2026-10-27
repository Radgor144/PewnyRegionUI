import { useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardLayout, MainSidebar } from '../components/Layout';
import { FiltersPanel } from '../features/filters';
import { RegionMap, CountyDetailsPanel } from '../features/map';
import { getTeryt } from '../features/map/utils/teryt';
import type { CountyFeature } from '../features/map';
import type { CountyScore, Variable } from '../types/api';

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/map" replace />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/counties" element={<UnavailablePage titleKey="sidebar.counties" />} />
            <Route path="/rankings" element={<UnavailablePage titleKey="sidebar.rankings" />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

function MapPage() {
    const [scoresData, setScoresData] = useState<CountyScore[] | null>(null);
    const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
    const [appliedVariables, setAppliedVariables] = useState<Variable[]>([]);
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState<boolean>(true);
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);
    const [selectedCounty, setSelectedCounty] = useState<CountyFeature | null>(null);
    const [detailsRequest, setDetailsRequest] = useState<{
        terytCode: string | null;
        selectedVariables: Variable[];
    } | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);

    const handleCountySelect = (feature: CountyFeature) => {
        setSelectedCounty(feature);
        setDetailsRequest({
            terytCode: feature.properties ? getTeryt(feature.properties) ?? null : null,
            selectedVariables: [...appliedVariables],
        });
        setIsDetailsOpen(true);
    };

    const handleMapGenerated = (data: CountyScore[], variables: Variable[]) => {
        setScoresData(data);
        setAppliedVariables([...variables]);
    };

    const handleFiltersReset = () => {
        setScoresData(null);
        setAppliedVariables([]);
        setSelectedCounty(null);
        setDetailsRequest(null);
    };

    return (
        <DashboardLayout
            sidebar={
                <MainSidebar
                    isOpen={isMainSidebarOpen}
                    toggleOpen={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
                />
            }
            filters={
                <FiltersPanel
                    selectedVariables={selectedVariables}
                    onVariableToggle={setSelectedVariables}
                    onMapGenerated={handleMapGenerated}
                    onFiltersReset={handleFiltersReset}
                    hasScores={scoresData !== null}
                    isOpen={isFiltersOpen}
                    setIsOpen={setIsFiltersOpen}
                    isMainSidebarOpen={isMainSidebarOpen}
                />
            }
            details={
                <CountyDetailsPanel
                    county={selectedCounty}
                    isOpen={isDetailsOpen}
                    setIsOpen={setIsDetailsOpen}
                    request={detailsRequest}
                />
            }
            map={
                <RegionMap
                    scoresData={scoresData}
                    isOpen={isFiltersOpen}
                    onCountySelect={handleCountySelect}
                />
            }
        />
    );
}

function UnavailablePage({ titleKey }: { titleKey: 'sidebar.counties' | 'sidebar.rankings' }) {
    const { t } = useTranslation();
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState(true);

    return (
        <DashboardLayout
            sidebar={
                <MainSidebar
                    isOpen={isMainSidebarOpen}
                    toggleOpen={() => setIsMainSidebarOpen(!isMainSidebarOpen)}
                />
            }
            filters={null}
            map={
                <main className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 pt-14 text-center" style={{ color: 'var(--color-text)' }}>
                    <h1 className="text-2xl font-bold">{t(titleKey)}</h1>
                    <p>{t('navigation.pageUnavailable')}</p>
                    <Link className="rounded-lg px-4 py-2 font-semibold" style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }} to="/map">
                        {t('navigation.backToMap')}
                    </Link>
                </main>
            }
        />
    );
}

function NotFoundPage() {
    const { t } = useTranslation();

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
            <h1 className="text-2xl font-bold">{t('navigation.notFound')}</h1>
            <Link className="rounded-lg px-4 py-2 font-semibold" style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }} to="/map">
                {t('navigation.backToMap')}
            </Link>
        </main>
    );
}

export default App;
