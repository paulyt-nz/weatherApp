import { convertLocationToCoords } from './weatherFunctions';
import { expect, jest, test } from '@jest/globals';

test("test correct coordinates are returned from mapbox api", async() => {
    const result = await convertLocationToCoords('Pukerua Bay');

    expect(result).toEqual([-41.034297,  174.888891])
})