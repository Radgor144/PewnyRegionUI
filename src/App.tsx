import { useState } from 'react';
import { Layout } from 'components/Layout/Layout';
import { FiltersPanel } from 'features/filters';
import { RegionMap } from 'features/map';
import { Variable, CountyScore } from 'api/types';

function App() {
    const [selectedVariables, setSelectedVariables] = useState<Variable[]>([]);
    const [countyScores, setCountyScores] = useState<CountyScore[] | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState<boolean>(true);

    return (
        <Layout>
            <FiltersPanel
                selectedVariables={selectedVariables}
                onVariableToggle={setSelectedVariables}
                onScoresUpdate={setCountyScores}
                isOpen={isPanelOpen}
                setIsOpen={setIsPanelOpen}
            />
            <RegionMap
                scoresData={countyScores}
                isOpen={isPanelOpen}
            />
        </Layout>
    );
}

export default App;