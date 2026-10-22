import type { Position } from 'geojson';
import type { CountyFeature, PolandOutlineFeature } from '../types';

interface BoundarySegment {
    start: Position;
    end: Position;
}

const positionKey = (position: Position) => position.join(',');

const segmentKey = (start: Position, end: Position) =>
    `${positionKey(start)}>${positionKey(end)}`;

export const createPolandOutline = (features: CountyFeature[]): PolandOutlineFeature => {
    const segments = new Map<string, BoundarySegment>();
    let provinceCount = 0;

    features.forEach(({ geometry, properties }) => {
        if (properties.typ !== 'woj') return;
        provinceCount += 1;

        const polygons = geometry.type === 'Polygon'
            ? [geometry.coordinates]
            : geometry.type === 'MultiPolygon'
                ? geometry.coordinates
                : [];

        polygons.forEach((polygon) => {
            const outerRing = polygon[0];
            for (let index = 0; index < outerRing.length - 1; index += 1) {
                const start = outerRing[index];
                const end = outerRing[index + 1];
                const key = segmentKey(start, end);
                const reverseKey = segmentKey(end, start);

                if (segments.has(reverseKey)) {
                    segments.delete(reverseKey);
                } else {
                    segments.set(key, { start, end });
                }
            }
        });
    });

    if (provinceCount === 0 || segments.size === 0) {
        throw new Error('Could not derive Poland outline from GeoJSON provinces.');
    }

    const outgoingSegments = new Map<string, BoundarySegment[]>();
    segments.forEach((segment) => {
        const key = positionKey(segment.start);
        const outgoing = outgoingSegments.get(key) ?? [];
        outgoing.push(segment);
        outgoingSegments.set(key, outgoing);
    });

    const remainingSegments = new Set(segments.values());
    const lines: Position[][] = [];

    while (remainingSegments.size > 0) {
        const firstSegment = remainingSegments.values().next().value as BoundarySegment | undefined;
        if (!firstSegment) break;

        remainingSegments.delete(firstSegment);
        const line = [firstSegment.start, firstSegment.end];
        const startKey = positionKey(firstSegment.start);
        let current = firstSegment.end;

        while (positionKey(current) !== startKey) {
            const nextSegment = outgoingSegments
                .get(positionKey(current))
                ?.find((segment) => remainingSegments.has(segment));

            if (!nextSegment) {
                throw new Error('Could not close Poland outline from GeoJSON provinces.');
            }

            remainingSegments.delete(nextSegment);
            line.push(nextSegment.end);
            current = nextSegment.end;
        }

        lines.push(line);
    }

    return {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'MultiLineString',
            coordinates: lines,
        },
    };
};
