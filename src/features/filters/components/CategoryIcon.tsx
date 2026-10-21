import type { ReactNode } from 'react';
import type { VariableCategory } from 'types/api';

const CATEGORY_ICON_CONTENT: Record<VariableCategory, ReactNode> = {
    SAFETY: (
        <>
            <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    HEALTH: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
    TRANSPORT: (
        <>
            <path d="m5 11 2-5h10l2 5" />
            <path d="M4 11h16l1 6H3l1-6Z" />
            <path d="M5 17v2m14-2v2M7 13h.01M17 13h.01" />
        </>
    ),
    POPULATION: (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="10" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </>
    ),
    LABOR: (
        <>
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2" />
        </>
    ),
    HOUSING: (
        <>
            <path d="m3 10 9-7 9 7" />
            <path d="M5 9v12h14V9M9 21v-7h6v7" />
        </>
    ),
    FINANCE: (
        <>
            <rect x="3" y="5" width="18" height="15" rx="2" />
            <path d="M3 9h18M16 15h.01" />
        </>
    ),
    OTHER: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v.01M12 12v4" />
        </>
    ),
};

interface CategoryIconProps {
    category: VariableCategory;
}

export const CategoryIcon = ({ category }: CategoryIconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0"
        aria-hidden="true"
    >
        {CATEGORY_ICON_CONTENT[category]}
    </svg>
);