import { getWeather } from './weatherFunctions';
import { expect, jest, test } from '@jest/globals';

test("test get weather is returning something something", async() => {
    const result = await getWeather('Pukerua Bay');

    expect(result).not.toBeNull()
})