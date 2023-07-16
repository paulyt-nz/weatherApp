require('dotenv').config();
import { getWeather } from './weatherFunctions';
import { expect, jest, test } from '@jest/globals';

test("test get weather is returning something something", async() => {
    const result = await getWeather('Pukerua Bay');
    console.log('Pukerua Bay co-ordinates:', result)
    expect(result).not.toBeNull()
})