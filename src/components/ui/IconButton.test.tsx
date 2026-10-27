import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
    it('applies its hover background through a CSS class', () => {
        render(<IconButton>Theme</IconButton>);

        const button = screen.getByRole('button', { name: 'Theme' });

        expect(button).toHaveClass(
            'bg-[var(--color-panel-alt)]',
            'hover:bg-[var(--color-hover)]',
        );
        expect(button).not.toHaveStyle({ backgroundColor: 'var(--color-panel-alt)' });
    });
});
