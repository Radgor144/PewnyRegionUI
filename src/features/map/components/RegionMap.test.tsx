import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../../../lib/i18n';
import { useCountyGeoData } from '../hooks/useCountyGeoData';
import { RegionMap } from './RegionMap';

vi.mock('react-leaflet', () => ({
    GeoJSON: () => null,
    MapContainer: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    Pane: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
    TileLayer: () => null,
}));
vi.mock('app/providers/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light' }),
}));
vi.mock('../hooks/useCountyGeoData', () => ({
    useCountyGeoData: vi.fn(),
}));
vi.mock('../hooks/useCountyScores', () => ({
    useCountyScores: () => ({ scoresMap: {}, scoreRange: { min: 0, max: 0 }, scoresVersion: 0 }),
}));
vi.mock('../hooks/useCountyInteractions', () => ({
    useCountyInteractions: () => ({
        onEachFeature: vi.fn(),
        selectFeature: vi.fn(),
        resetAll: vi.fn(),
        handleInteractionStart: vi.fn(),
    }),
}));
vi.mock('./MapViewportEffects', () => ({ MapViewportEffects: () => null }));
vi.mock('./MapLegend', () => ({ MapLegend: () => null }));
vi.mock('./SearchControl', () => ({ SearchControl: () => null }));

describe('RegionMap GeoJSON status', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('pl');
        vi.mocked(useCountyGeoData).mockReset();
    });

    it('shows a loading status while the county boundaries are loading', () => {
        vi.mocked(useCountyGeoData).mockReturnValue({
            data: null,
            loading: true,
            error: null,
        });

        render(<RegionMap scoresData={null} isOpen={false} />);

        expect(screen.getByRole('status')).toHaveTextContent('Ładowanie danych mapy...');
    });

    it('shows an error when county boundaries cannot be loaded', () => {
        vi.mocked(useCountyGeoData).mockReturnValue({
            data: null,
            loading: false,
            error: new Error('GeoJSON request failed'),
        });

        render(<RegionMap scoresData={null} isOpen={false} />);

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Nie udało się załadować danych mapy. Odśwież stronę, aby spróbować ponownie.',
        );
    });
});
