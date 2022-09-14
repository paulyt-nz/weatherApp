import { checkWeatherMatchesConstraints } from './weatherFunctions'
import { expect, jest, test } from '@jest/globals';
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
            max: 25
        }

    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(true)
})

test("test if wind speed is outside range gives true", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        windSpeed: {
            min: 10,
            max: 25
        }
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(false)
})

test("test if temperature is inside range gives true", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 20
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        temperature: {
            min: 10,
            max: 25
        }
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(true)
})

test("test if temperature is outside range gives false", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        temperature: {
            min: 10,
            max: 20
        }
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(false)
})

test("test if humidity is inside range gives true", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        humidity: {
            min: 45,
            max: 55
        }
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(true)
})

test("test if humidity is outside range gives false", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N'],
        humidity: {
            min: 40,
            max: 45
        }
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(false)
})

test("test if correct wind direction gives true", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'N',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N']
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(true)
})

test("test if incorrect wind direction gives false", () =>{
    //Arrange - get the data together for testing
    const weatherTestValues: Weather = {
        windDir: 'NW',
        windSpeed: 30,
        humidity: 50,
        temperature: 25
    }
    const constraintTestValues: WeatherConstaint = {
        windDir: ['N', 'NE', 'E', 'SE', 'S']
    }

    //Act - run the function and save the result
    const result = checkWeatherMatchesConstraints(constraintTestValues, weatherTestValues)

    //Assert - run the testing functions
    expect(result).toBe(false)
})
