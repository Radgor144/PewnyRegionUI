import i18n from 'i18next';
import type { CountyFeature } from '../types';
import { getCountyName } from './countySearch';

export const buildCountyTooltipHtml = (feature: CountyFeature, score: number | undefined): string => {
    const countyName = getCountyName(feature);
    const noDataText = i18n.t('map.noData');
    const scoreLabel = i18n.t('map.score');

    const scoreHtml = score != null
        ? `<div class="mt-1 text-blue-600 dark:text-blue-400 font-bold text-sm">${scoreLabel}: ${score.toFixed(2)}</div>`
        : `<div class="mt-1 text-slate-400 text-xs font-medium">${noDataText}</div>`;

    return `<div class="text-center min-w-[90px]">
        <strong class="text-slate-900 text-[13px]">${countyName}</strong>
        ${scoreHtml}
    </div>`;
};