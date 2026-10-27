import { useId } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { VariableDetail } from 'types/api';

interface ChartCardProps {
    variable: VariableDetail;
    title: string;
}

export const ChartCard = ({ variable, title }: ChartCardProps) => {
    const gradientId = `colorRawValue-${useId()}`;
    const { t } = useTranslation();
    const data = [...variable.yearlyValues].sort((a, b) => a.year - b.year);

    return (
        <div
            className="rounded-lg p-3 mb-3 shadow-sm"
            style={{
                backgroundColor: 'var(--color-panel)',
                border: '1px solid var(--color-border)',
            }}
        >
            <h3 className="text-xs font-bold mb-2.5" style={{ color: 'var(--color-text)' }}>
                {title}
            </h3>

            <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={'var(--color-chart-stroke-primary)'} stopOpacity={0.4} />
                                <stop offset="95%" stopColor={'var(--color-chart-stroke-primary)'} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" opacity={0.6} vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="var(--color-chart-axis)"
                            tick={{ fontSize: 10, fill: 'var(--color-chart-text)' }}
                            tickMargin={6}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="var(--color-chart-axis)"
                            tick={{ fontSize: 10, fill: 'var(--color-chart-text)' }}
                            tickMargin={6}
                            axisLine={false}
                            tickLine={false}
                            scale="auto"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-tooltip-bg-alpha)',
                                border: 'none',
                                borderRadius: '8px',
                                color: 'var(--color-tooltip-text)',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 700 }}
                            labelStyle={{ color: 'var(--color-chart-average)', marginBottom: '4px', fontSize: '10px', fontWeight: 700 }}
                            formatter={(value: any, name: any) => {
                                const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
                                const formattedName = name === 'rawValue'
                                    ? t('countyDetails.thisCounty')
                                    : t('countyDetails.nationalAverage');
                                return [formattedValue, formattedName];
                            }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '8px' }}
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-[10px] font-medium ml-1" style={{ color: 'var(--color-text)' }}>
                                    {value === 'rawValue'
                                        ? t('countyDetails.thisCounty')
                                        : t('countyDetails.nationalAverage')}
                                </span>
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="rawValue"
                            stroke={'var(--color-chart-stroke-primary)'}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill={`url(#${gradientId})`}
                            dot={{ r: 2, strokeWidth: 1, fill: 'var(--color-dot-this-county)', stroke: 'var(--color-chart-stroke-primary)' }}
                            activeDot={{ r: 4, strokeWidth: 0, fill: 'var(--color-chart-stroke-primary)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="averageScore"
                            stroke="var(--color-chart-average)"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0, fill: 'var(--color-chart-average)' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
