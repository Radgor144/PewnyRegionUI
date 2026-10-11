import i18n from 'i18next';
import type { CountyFeature } from 'features/map/types';
import { getCountyName } from './countySearch';

export const buildCountyTooltipHtml = (feature: CountyFeature, score: number | undefined): string => {
    const countyName = getCountyName(feature);
    const noDataText = i18n.t('map.noData');
    const scoreLabel = i18n.t('map.score');

    const scoreHtml = score != null
        ? `<div class="tooltip-score">${scoreLabel}: ${score.toFixed(2)}</div>`
        : `<div class="tooltip-empty">${noDataText}</div>`;

    return `<div class="tooltip-content"><strong>${countyName}</strong>${scoreHtml}</div>`;
};