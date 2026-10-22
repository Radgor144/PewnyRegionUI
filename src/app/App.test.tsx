import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '../lib/i18n';
import { ThemeProvider } from './providers/ThemeContext';
import { App } from './App';

vi.mock('../features/filters', () => ({
    FiltersPanel: () => <div data-testid="filters-panel" />,
}));

vi.mock('../features/map', () => ({
    RegionMap: () => <div data-testid="map-panel" />,
    CountyDetailsPanel: () => null,
}));

const renderApp = (initialEntry = '/') => render(
    <MemoryRouter
        initialEntries={[initialEntry]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
        <ThemeProvider>
            <App />
            <CurrentPath />
        </ThemeProvider>
    </MemoryRouter>,
);

const CurrentPath = () => {
    const { pathname } = useLocation();
    return <output data-testid="current-path">{pathname}</output>;
};

describe('App sidebar', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('pl');
    });

    it('opens the county subpage when its navigation link is clicked', () => {
        renderApp();

        fireEvent.click(screen.getByRole('link', { name: 'Powiaty' }));

        expect(screen.getByRole('heading', { name: 'Powiaty' })).toBeInTheDocument();
        expect(screen.getByText('Widok w przygotowaniu')).toBeInTheDocument();
        expect(screen.getByTitle('Powiaty')).toHaveClass('sidebar-button--accent');
        expect(screen.getByTitle('Mapa')).not.toHaveClass('sidebar-button--accent');
    });

    it('opens the rankings subpage when its navigation link is clicked', () => {
        renderApp();

        fireEvent.click(screen.getByRole('link', { name: 'Rankingi' }));

        expect(screen.getByRole('heading', { name: 'Rankingi' })).toBeInTheDocument();
        expect(screen.getByText('Widok w przygotowaniu')).toBeInTheDocument();
        expect(screen.getByTitle('Rankingi')).toHaveClass('sidebar-button--accent');
    });

    it('renders the map on the root route', () => {
        renderApp();

        expect(screen.getByTestId('map-panel')).toBeInTheDocument();
    });

    it('opens the map subpage when its navigation link is clicked', () => {
        renderApp('/powiaty');

        fireEvent.click(screen.getByRole('link', { name: 'Mapa' }));

        expect(screen.getByTestId('current-path')).toHaveTextContent('/map');
        expect(screen.getByTestId('map-panel')).toBeInTheDocument();
    });

    it('collapses the sidebar when the menu button is clicked', () => {
        renderApp();
        const sidebar = screen.getByTitle('Menu').closest('aside');

        expect(sidebar).toHaveClass('w-40');

        fireEvent.click(screen.getByTitle('Menu'));

        expect(sidebar).toHaveClass('w-12');
    });

    it('keeps hover styles as static classes on navigation buttons', () => {
        renderApp();

        for (const title of ['Mapa', 'Powiaty', 'Rankingi']) {
            expect(screen.getByTitle(title)).toHaveClass('hover:bg-[var(--color-hover)]');
        }

        expect(screen.getByTitle('Menu')).toHaveClass('hover:bg-[var(--color-hover)]');
    });
});
