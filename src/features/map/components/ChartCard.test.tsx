import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { VariableDetail } from 'types/api';
import { ChartCard } from './ChartCard';

vi.mock('recharts', () => ({
    AreaChart: ({ children }: { children: ReactNode }) => <svg>{children}</svg>,
    Area: ({ fill }: { fill: string }) => <path fill={fill} />,
    CartesianGrid: () => null,
    Legend: () => null,
    Line: () => null,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <>{children}</>,
    Tooltip: () => null,
    XAxis: () => null,
    YAxis: () => null,
}));

const variable: VariableDetail = {
    apiName: 'crime_detection_rate',
    yearlyValues: [{ year: 2024, rawValue: 10, averageScore: 5 }],
};

describe('ChartCard', () => {
    it('uses a unique gradient for each chart and references it from its area', () => {
        const { container } = render(
            <>
                <ChartCard variable={variable} title="First chart" />
                <ChartCard variable={variable} title="Second chart" />
            </>,
        );

        const gradients = Array.from(container.querySelectorAll('linearGradient'));
        const gradientIds = gradients.map(gradient => gradient.id);
        const areaFills = Array.from(container.querySelectorAll('[fill^="url(#"]'))
            .map(area => area.getAttribute('fill'));

        expect(gradientIds).toHaveLength(2);
        expect(new Set(gradientIds).size).toBe(2);
        expect(areaFills).toEqual(gradientIds.map(id => `url(#${id})`));
    });
});
