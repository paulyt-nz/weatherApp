import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../types/weatherTypes'
import { type Db, MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import { log } from '../common/logger';

const MapBoxApiKey = process.env.MAPBOX;
if (!MapBoxApiKey) {
  log.error('Missing MAPBOX API key from .env vars')
  throw new Error("Missing MAPBOX API key from .env vars");
}

const OpenWeatherApiKey = process.env.OPEN_WEATHER;
if (!OpenWeatherApiKey) {
  log.error('Missing OPEN_WEATHER API key from .env vars')
  throw new Error("Missing OPEN_WEATHER API key from .env vars");
}


export async function getRequests(db: Db): Promise<WeatherNotificationSubscription[]> {
    // todo check database for requests
    // todo support pagination or streaming
    // todo look into what a generic is
    log.debug('Getting requests from Mongo')
    const collection = db.collection<WeatherNotificationSubscription>('subs');
  
    return collection.find().toArray()
  }


export function convertDegToCompass(deg: number): WindDirection {
    if (deg < 0 || deg > 360) {
      throw new Error('Invalid angle')
    }
  
    if (deg < 22.5) {
        return 'N'
    } else if (deg < 67.5) {  
        return 'NE'
    } else if (deg < 112.5) {
        return 'E'
    } else if (deg < 157.5) {
        return 'SE'
    } else if (deg < 202.5) {
        return 'S'
    } else if (deg < 247.5) {
        return 'SW'
    } else if (deg < 292.5) {
        return 'W'
    } else if (deg < 337.5) {
        return 'NW'
    } else {
        return 'N'
  }
}
  

export async function getWeather(coords: number[]): Promise<Weather | null> {
  
  if (!coords) {
    log.error('No coords found')
    return null;
  }

  const [lat, lon] = coords;
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherApiKey}&units=metric`

  try{
    const res = await fetch(url);
    const data = await res.json();

    const weather: Weather = {
      temperature: data.main.temp,
      windSpeed: data.wind.speed,
      windDir: convertDegToCompass(data.wind.deg),
      humidity: data.main.humidity,
    }

    return weather;
  } 
  catch (err) {
    log.error("Could not get Weather", err)
    return null
  }
}
  

export function checkWeatherMatchesConstraints(
    constraints: WeatherConstaint,
    weather: Weather
  ): boolean {

      if(constraints.windSpeed) {
        if (constraints.windSpeed.min !== undefined) {
          if(weather.windSpeed < constraints.windSpeed.min) {
            log.debug(`windspeed is less than min - min=${constraints.windSpeed.min} actual=${weather.windSpeed}`)
            return false;
          }
        }
        if (constraints.windSpeed.max !== undefined) {
          if(weather.windSpeed > constraints.windSpeed.max) {
            log.debug(`windspeed is more than max - max=${constraints.windSpeed.max} actual=${weather.windSpeed}`)
            return false;
          }
        }
      }
  
      if(constraints.temperature) {
        if (constraints.temperature.min !== undefined) {
          if(weather.temperature < constraints.temperature.min) {
            log.debug(`temerature is less than min - min=${constraints.temperature.min} actual=${weather.temperature}`)
            return false;
          }
        }
        if (constraints.temperature.max !== undefined) {
          if(weather.temperature > constraints.temperature.max) {
            log.debug(`temperature is more than max - max=${constraints.temperature.max} actual=${weather.temperature}`)
            return false;
          }
        }
      }
  
      if(constraints.humidity) {
        if (constraints.humidity.min !== undefined) {
          if(weather.humidity < constraints.humidity.min) {
            log.debug(`humidity is less than min - min=${constraints.humidity.min} actual=${weather.humidity}`)
            return false;
          }
        }
        if (constraints.humidity.max !== undefined) {
          if(weather.humidity > constraints.humidity.max) {
            log.debug(`humidity is more than max - max=${constraints.humidity.max} actual=${weather.humidity}`)
            return false;
          }
        }
      }
  
      if(constraints.windDir !== undefined) {
        let windDirMatch = constraints.windDir.some(dir => dir === weather.windDir) // true or false
        
        if(windDirMatch === false) {
          log.debug(`wind direction does not match - expected=${constraints.windDir} actual=${weather.windDir}`)
          return false
        }
      }
    return true
  }