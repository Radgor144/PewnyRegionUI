import { useState } from 'react';
import { MainSidebar } from 'components/Layout/MainSidebar';
import { FiltersPanel } from 'features/filters';
import { RegionMap } from 'features/map';
import { DashboardLayout } from "./features/map/DashboardLayout";
import { CountyScore, Variable } from "./types/api";

export function App() {
    const [scoresData, setScoresData] = useState<CountyScore[] | null>(null);
    const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
    const [isMainSidebarOpen, setIsMainSidebarOpen] = useState<boolean>(true);
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);

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
                    onScoresUpdate={setScoresData}
                    isOpen={isFiltersOpen}
                    setIsOpen={setIsFiltersOpen}
                    isMainSidebarOpen={isMainSidebarOpen}
                />
            }
            map={
                <RegionMap scoresData={scoresData} isOpen={isFiltersOpen} />
            }
        />
    );
}

export default App;