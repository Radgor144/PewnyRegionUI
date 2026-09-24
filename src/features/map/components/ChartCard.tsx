import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { VariableDetail } from 'types/api';

interface ChartCardProps {
    variable: VariableDetail;
    title: string;
}

export const ChartCard = ({ variable, title }: ChartCardProps) => {
    const { t } = useTranslation();

    const data = [...variable.yearlyValues].sort((a, b) => a.year - b.year);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">
                {title}
            </h3>

            <div className="w-full h-36">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRawValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.15} vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke="#94a3b8"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickMargin={6}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fontSize: 10, fill: '#94a3b8' }}
                            tickMargin={6}
                            axisLine={false}
                            tickLine={false}
                            scale="auto"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#f8fafc',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 500 }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontSize: '11px' }}
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
                                <span className="text-slate-600 dark:text-slate-300 text-[11px] font-medium ml-1">
                                    {value === 'rawValue'
                                        ? t('countyDetails.thisCounty')
                                        : t('countyDetails.nationalAverage')}
                                </span>
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="rawValue"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorRawValue)"
                            dot={{ r: 3, strokeWidth: 1.5, fill: '#1e293b', stroke: '#3b82f6' }}
                            activeDot={{ r: 5, strokeWidth: 0, fill: '#3b82f6' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="averageScore"
                            stroke="#94a3b8"
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0, fill: '#94a3b8' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
