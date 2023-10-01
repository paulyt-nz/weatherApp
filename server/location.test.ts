//require('dotenv').config();
process.env.MAPBOX = 'mock-mapbox-api-key';
import { convertLocationToCoords } from './location';
import fetch from 'node-fetch';

jest.mock('node-fetch', () => {
    return jest.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            features:
                [
                    { center: [174.7771111, -41.289111] }
                ]
            }),
        })
    )
});

describe('convertLocationToCoords', () => {
    it('should return coordinates for a valid location', async () => {
        const location = 'Wellington';
        console.log('location: ', location)
        const coords = await convertLocationToCoords(location);
        expect(coords).toEqual([-41.289, 174.777]);
    });
});


