import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { Db, MongoClient } from 'mongodb';

export async function getRequests(db: Db): Promise<WeatherNotificationSubscription[]> {
    // todo check database for requests
    // todo support pagination or streaming
    // todo look into what a generic is
    const collection = db.collection<WeatherNotificationSubscription>('subs');
  
    return collection.find().toArray()
  }
  
export async function getWeather(location: string): Promise<Weather | null> {
     const getRandomWind = (): WindDirection => {
        const directions: WindDirection[] = ["N" , "NE" , "E" , "SE",  "S" , "SW" , "W" , "NW"]
        return directions[Math.floor(Math.random() * directions.length)]
     }
  
  
      const weather: Weather = {
        humidity: Math.random() * 100,
        temperature: Math.random() * 40,
        windDir: getRandomWind(),
        windSpeed: Math.random() * 100
  
    }
    return Promise.resolve(weather)
  }
  
export function checkOneWeatherWithConstraints(constraintValueMin: number, constraintValueMax: number, weatherValue: number ): boolean {
    if (weatherValue > constraintValueMin && weatherValue < constraintValueMax) {
        console.debug('inside checkOneWeatherWithConstraints true')
      return true
    } else {
        console.debug('inside checkOneWeatherWithConstraints false')
      return false
    }
  }
  
  
  // todo use jest to test
export function checkWeatherMatchesConstraints(
    constraints: WeatherConstaint,
    weather: Weather
  ): boolean {
    // todo check if weather matches
  
      if(constraints.windSpeed) {
        if (constraints.windSpeed.min !== undefined) {
          if(weather.windSpeed < constraints.windSpeed.min) {
            console.debug(`windspeed is less than min - min=${constraints.windSpeed.min} actual=${weather.windSpeed}`)
            return false;
          }
        }
        if (constraints.windSpeed.max !== undefined) {
          if(weather.windSpeed > constraints.windSpeed.max) {
            console.debug('windspeed is more than max')
            return false;
          }
        }
      }
  
      if(constraints.temperature) {
        if (constraints.temperature.min !== undefined) {
          if(weather.temperature < constraints.temperature.min) {
            return false;
          }
        }
        if (constraints.temperature.max !== undefined) {
          if(weather.temperature > constraints.temperature.max) {
            return false;
          }
        }
      }
  
      if(constraints.humidity) {
        if (constraints.humidity.min !== undefined) {
          if(weather.humidity < constraints.humidity.min) {
            return false;
          }
        }
        if (constraints.humidity.max !== undefined) {
          if(weather.humidity > constraints.humidity.max) {
            return false;
          }
        }
      }
  
      if(constraints.windDir !== undefined) {
        let windDirMatch = constraints.windDir.some(dir => dir === weather.windDir) // true or false
        
        if(windDirMatch === false) {
          return false
        }
      }
    return true
  }