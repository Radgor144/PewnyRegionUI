import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
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

const renderApp = (route = '/map') => render(
    <MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </MemoryRouter>,
);

describe('App routes', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('pl');
    });

    it.each([
        ['/counties', 'Powiaty'],
        ['/rankings', 'Rankingi'],
    ])('shows the shared app shell on %s', (route, title) => {
        renderApp(route);

        expect(screen.getByRole('heading', { name: title })).toBeInTheDocument();
        expect(screen.getByText('Ta podstrona nie jest jeszcze dostępna.')).toBeInTheDocument();
        expect(screen.queryByTestId('map-panel')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pewny Region' })).toBeInTheDocument();
        expect(screen.getByTitle('Mapa')).toHaveAttribute('href', '/map');
        expect(screen.getByTitle('Powiaty')).toHaveAttribute('href', '/counties');
        expect(screen.getByTitle('Rankingi')).toHaveAttribute('href', '/rankings');
        expect(screen.getByTitle(title)).toHaveClass('sidebar-button--accent');
        expect(screen.getByRole('link', { name: 'Wróć do mapy' })).toHaveAttribute('href', '/map');
    });

    it('navigates from an unavailable route back to the map', () => {
        renderApp('/rankings');

        fireEvent.click(screen.getByRole('link', { name: 'Wróć do mapy' }));

        expect(screen.getByTestId('map-panel')).toBeInTheDocument();
    });

    it('uses the /map URL for the map navigation link', () => {
        renderApp();

        expect(screen.getByTitle('Mapa')).toHaveAttribute('href', '/map');
    });

    it('navigates to the counties page from the sidebar', () => {
        renderApp();

        fireEvent.click(screen.getByTitle('Powiaty'));

        expect(screen.getByRole('heading', { name: 'Powiaty' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pewny Region' })).toBeInTheDocument();
        expect(screen.queryByTestId('map-panel')).not.toBeInTheDocument();
    });

    it('navigates to the rankings page from the sidebar', () => {
        renderApp();

        fireEvent.click(screen.getByTitle('Rankingi'));

        expect(screen.getByRole('heading', { name: 'Rankingi' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Pewny Region' })).toBeInTheDocument();
        expect(screen.queryByTestId('map-panel')).not.toBeInTheDocument();
    });

    it('shows the shared header and sidebar on the map page', () => {
        renderApp();

        expect(screen.getByRole('heading', { name: 'Pewny Region' })).toBeInTheDocument();
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

        expect(screen.getByTitle('Menu')).toHaveClass('hover:bg-[var(--color-hover)]');
    });
});
