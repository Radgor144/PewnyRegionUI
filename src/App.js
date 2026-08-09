import React, { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { FiltersPanel } from './features/filters';
import { RegionMap } from './features/map';

function App() {
    const [selectedVariables, setSelectedVariables] = useState([]);
    const [countyScores, setCountyScores] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(true);

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