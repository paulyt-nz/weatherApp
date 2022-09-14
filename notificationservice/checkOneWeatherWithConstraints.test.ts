import { checkOneWeatherWithConstraints } from './weatherFunctions'
import { expect, jest, test } from '@jest/globals';

test("test if weather value is within the constraint range", () =>{
    //Arrange - get the data together for testing
    const weatherTestValue = 15;
    const constraintMin = 10;
    const constriantMax = 20;
        
    //Act - run the function and save the result
    const result = checkOneWeatherWithConstraints(constraintMin, constriantMax, weatherTestValue)

    //Assert - run the testing functions
    expect(result).toBe(true)
})

test("test if weather value is outside the constraint range", () =>{
    //Arrange - get the data together for testing
    const weatherTestValue = 25;
    const constraintMin = 10;
    const constriantMax = 20;
        
    //Act - run the function and save the result
    const result = checkOneWeatherWithConstraints(constraintMin, constriantMax, weatherTestValue)

    //Assert - run the testing functions
    expect(result).toBe(false)
})
