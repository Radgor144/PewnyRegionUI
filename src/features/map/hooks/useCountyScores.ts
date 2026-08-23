import { useMemo, useState, useEffect } from 'react';
import type { CountyScore } from '../../../types/api';
import { DEFAULT_SCORE_RANGE } from '../constants';
import { isValidCountyId, terytFromCountyId } from '../utils/teryt';
import type { ScoreRange, ScoresLookup } from '../types';

interface UseCountyScoresResult {
    scoresMap: ScoresLookup | null;
    scoreRange: ScoreRange;
    scoresVersion: number;
}

export const useCountyScores = (scoresData: CountyScore[] | null): UseCountyScoresResult => {
    const [scoresVersion, setScoresVersion] = useState(0);

    const scoresMap = useMemo<ScoresLookup | null>(() => {
        if (!scoresData) return null;
        const map: ScoresLookup = {};

        scoresData.forEach((item) => {
            if (isValidCountyId(item.countyId)) {
                map[terytFromCountyId(item.countyId)] = item.score;
            }
        });
        return map;
    }, [scoresData]);

    useEffect(() => {
        setScoresVersion((v) => v + 1);
    }, [scoresMap]);

    const scoreRange = useMemo<ScoreRange>(() => {
        if (!scoresData || scoresData.length === 0) return DEFAULT_SCORE_RANGE;
        const scores = scoresData.map((item) => item.score);
        return { min: Math.min(...scores), max: Math.max(...scores) };
    }, [scoresData]);

    return { scoresMap, scoreRange, scoresVersion };
};