import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'app/providers/ThemeContext';
import {
    COLOR_F8FAFC,
    CHART_GRID_DARK,
    CHART_GRID_LIGHT,
    CHART_AXIS_DARK,
    CHART_AXIS_LIGHT,
    CHART_TEXT_DARK,
    CHART_TEXT_LIGHT,
    CHART_DOT_DARK,
    CHART_DOT_LIGHT,
    CHART_STROKE_PRIMARY,
    CHART_LINE_AVERAGE_DARK,
    CHART_LINE_AVERAGE_LIGHT,
    CHART_GRADIENT_OPACITY_START,
    CHART_GRADIENT_OPACITY_END,
} from 'lib/colors';
import { VariableDetail } from 'types/api';

interface ChartCardProps {
    variable: VariableDetail;
    title: string;
}

export const ChartCard = ({ variable, title }: ChartCardProps) => {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const data = [...variable.yearlyValues].sort((a, b) => a.year - b.year);

    // Dostosuj kolory do motywu
    const gridStroke = theme === 'dark' ? CHART_GRID_DARK : CHART_GRID_LIGHT;
    const gridOpacity = theme === 'dark' ? 0.3 : 0.4;
    const axisStroke = theme === 'dark' ? CHART_AXIS_DARK : CHART_AXIS_LIGHT;
    const axisFill = theme === 'dark' ? CHART_TEXT_DARK : CHART_TEXT_LIGHT;
    const dotFill = theme === 'dark' ? CHART_DOT_DARK : CHART_DOT_LIGHT;
    const lineAverageStroke = theme === 'dark' ? CHART_LINE_AVERAGE_DARK : CHART_LINE_AVERAGE_LIGHT;
    const legendTextClass = theme === 'dark' ? 'text-slate-300' : 'text-slate-700';

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 mb-3 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-2.5">
                {title}
            </h3>

            <div className="w-full h-32">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRawValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={CHART_STROKE_PRIMARY} stopOpacity={CHART_GRADIENT_OPACITY_START} />
                                <stop offset="95%" stopColor={CHART_STROKE_PRIMARY} stopOpacity={CHART_GRADIENT_OPACITY_END} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={gridOpacity} vertical={false} />
                        <XAxis
                            dataKey="year"
                            stroke={axisStroke}
                            tick={{ fontSize: 10, fill: axisFill }}
                            tickMargin={6}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            stroke={axisStroke}
                            tick={{ fontSize: 10, fill: axisFill }}
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
                                color: COLOR_F8FAFC,
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 500 }}
                            labelStyle={{ color: lineAverageStroke, marginBottom: '4px', fontSize: '10px' }}
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
                                <span className={`${legendTextClass} text-[10px] font-medium ml-1`}>
                                    {value === 'rawValue'
                                        ? t('countyDetails.thisCounty')
                                        : t('countyDetails.nationalAverage')}
                                </span>
                            )}
                        />
                        <Area
                            type="monotone"
                            dataKey="rawValue"
                            stroke={CHART_STROKE_PRIMARY}
                            strokeWidth={2.5}
                            fillOpacity={1}
                            fill="url(#colorRawValue)"
                            dot={{ r: 3, strokeWidth: 1.5, fill: dotFill, stroke: CHART_STROKE_PRIMARY }}
                            activeDot={{ r: 5, strokeWidth: 0, fill: CHART_STROKE_PRIMARY }}
                        />
                        <Line
                            type="monotone"
                            dataKey="averageScore"
                            stroke={lineAverageStroke}
                            strokeWidth={1.5}
                            strokeDasharray="4 4"
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0, fill: lineAverageStroke }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
