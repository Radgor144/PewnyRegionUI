import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
    it('applies its hover background through a CSS class', () => {
        render(<IconButton>Theme</IconButton>);

        expect(screen.getByRole('button', { name: 'Theme' })).toHaveClass(
            'hover:bg-[var(--color-hover)]',
        );
    });
});
