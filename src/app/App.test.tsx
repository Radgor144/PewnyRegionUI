import { fireEvent, render, screen } from '@testing-library/react';
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

const renderApp = () => render(
    <ThemeProvider>
        <App />
    </ThemeProvider>,
);

describe('App sidebar', () => {
    beforeEach(async () => {
        await i18n.changeLanguage('pl');
    });

    it('changes the selected section when a navigation button is clicked', () => {
        renderApp();

        expect(screen.getByTitle('Mapa')).toHaveClass('sidebar-button--accent');

        fireEvent.click(screen.getByTitle('Powiaty'));

        expect(screen.getByTitle('Powiaty')).toHaveClass('sidebar-button--accent');
        expect(screen.getByTitle('Mapa')).not.toHaveClass('sidebar-button--accent');
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
