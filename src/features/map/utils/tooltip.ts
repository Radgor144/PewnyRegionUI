import i18n from 'i18next';
import type { CountyFeature } from '../types';

const getCountyDisplayName = (feature: CountyFeature): string =>
    feature.properties.JPT_NAZWA_ ?? feature.properties.nazwa ?? 'County';

export const buildCountyTooltipHtml = (feature: CountyFeature, score: number | undefined): string => {
    const countyName = getCountyDisplayName(feature);

    const noDataText = i18n.t('map.noData', { defaultValue: 'Brak danych' });
    const scoreLabel = i18n.t('map.score', { defaultValue: 'Score' });

    const scoreHtml = score != null
        ? `<div class="mt-1 text-blue-600 dark:text-blue-400 font-bold text-sm">${scoreLabel}: ${score.toFixed(2)}</div>`
        : `<div class="mt-1 text-slate-400 text-xs font-medium">${noDataText}</div>`;

    return `<div class="text-center min-w-[90px]">
        <strong class="text-slate-900 text-[13px]">${countyName}</strong>
        ${scoreHtml}
    </div>`;
};