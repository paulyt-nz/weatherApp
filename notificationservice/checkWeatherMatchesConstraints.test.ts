import {checkWeatherMatchesConstraints} from './index'
import {expect, jest, test} from '@jest/globals';
import { WeatherConstaint, Weather } from '../common/weather'


// checks to run
//  - Each constraint with one pass and one fail - will need a correct wind dir (we have required this)
//  - wind dir pass and fails with nothing else


test("test if wind speed in correct range gives true", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 20,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        windSpeed: {
            min: 10,
            max: 15
        }

    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(false)
})