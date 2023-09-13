require('dotenv').config();
import { getWeather } from './weatherFunctions';
import { expect, jest, test } from '@jest/globals';

test("test get weather is returning something", async() => {
    const testCoords = [ -41, 174 ]
    const result = await getWeather(testCoords);
    console.log('Pukerua Bay co-ordinates:', result)
    expect(result).not.toBeNull()
})