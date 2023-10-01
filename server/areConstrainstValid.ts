import { WindDirection, WeatherConstaint } from '../common/weatherTypes'
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
      if (!constraints.windSpeed.min && !constraints.windSpeed.max) {
        log.error("Invalid windSpeed constraints")
        return false;
      }
      if (constraints.windSpeed.min && constraints.windSpeed.max) {
        if (constraints.windSpeed.min > constraints.windSpeed.max) {
          log.error("Wind speed min is greater than max")
          return false;
        }
      }
    }
  
    if (constraints.temperature) {
      if (!constraints.temperature.min && !constraints.temperature.max) {
        log.error("Invalid temperature constraints")
        return false;
      }
      if (constraints.temperature.min && constraints.temperature.max) {
        if (constraints.temperature.min > constraints.temperature.max) {
          log.error("Temperature min is greater than max")
          return false;
        }
      }
    }
  
    if (constraints.humidity) {
      if (!constraints.humidity.min && !constraints.humidity.max) {
        log.error("Invalid humidity constraints")
        return false;
      }
      if (constraints.humidity.min && constraints.humidity.max) {
        if (constraints.humidity.min > constraints.humidity.max) {
          log.error("Humidity min is greater than max")
          return false;
        }
      }
    }
    return true;
}