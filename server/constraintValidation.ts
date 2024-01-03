import { WindDirection, WeatherConstaint } from '../types/weatherTypes'
import { log } from "../common/logger";

export function areConstraintsValid(constraints: Partial<WeatherConstaint>): boolean {
    log.debug("Validating constraints")
    log.debug("Constraints: ", constraints)
  
    if (constraints.windDir && constraints.windDir.length) {
      const validWindDirections : WindDirection[] = [ "N", "NE", "E", "SE", "S", "SW", "W", "NW" ]
  
      for (let dir of constraints.windDir) {
        if (!validWindDirections.includes(dir)) {
          log.error("Invalid wind direction")
          return false;
        }
      }
    }
  
    if (constraints.windSpeed) {
      if (constraints.windSpeed.min !== undefined && constraints.windSpeed.max !== undefined) {
        if (constraints.windSpeed.min > constraints.windSpeed.max) {
          log.error("Wind speed min is greater than max")
          return false;
        }
      }
    }
  
    if (constraints.temperature) {
      if (constraints.temperature.min !== undefined && constraints.temperature.max !== undefined) {
        if (constraints.temperature.min > constraints.temperature.max) {
          log.error("Temperature min is greater than max")
          return false;
        }
      }
    }
  
    if (constraints.humidity) {
      if (constraints.humidity.min !== undefined && constraints.humidity.max !== undefined) {
        if (constraints.humidity.min > constraints.humidity.max) {
          log.error("Humidity min is greater than max")
          return false;
        }
      }
    }
    return true;
}