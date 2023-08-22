require('dotenv').config();
import { convertLocationToCoords } from './weatherFunctions';
import { expect, jest, test } from '@jest/globals';

test("test correct coordinates are returned from mapbox api", async() => {
    const result = await convertLocationToCoords('Pukerua Bay');

    expect(result).toEqual([-41.037441,  174.885445])
})