import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { type Db, MongoClient } from 'mongodb';
import fetch from 'node-fetch';

const MapBoxApiKey = process.env.MAPBOX;
if (!MapBoxApiKey) {
  throw new Error("Missing MAPBOX API key from .env vars");
}

const OpenWeatherApiKey = process.env.OPEN_WEATHER;
if (!OpenWeatherApiKey) {
  throw new Error("Missing OPEN_WEATHER API key from .env vars");
}

export async function getRequests(db: Db): Promise<WeatherNotificationSubscription[]> {
    // todo check database for requests
    // todo support pagination or streaming
    // todo look into what a generic is
    const collection = db.collection<WeatherNotificationSubscription>('subs');
  
    return collection.find().toArray()
  }

  export async function convertLocationToCoords (location: string): Promise<number[] | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MapBoxApiKey}`

    try {
        const res = await fetch(url)
        console.debug("res:  ", res)
        const data = await res.json()
        console.debug("data:  ",data)

        const [lon, lat] : number[] = data.features[0].center
        console.debug('lat: ', lat, 'long: ', lon)

        return Promise.resolve([lat, lon])
    }
    catch (err) {
        console.error('ERROR', err)
        return null
    }
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
  
export async function getWeather(location: string): Promise<Weather | null> {
  const coords = await convertLocationToCoords(location);
  
  if (!coords) {
    console.error('No coords found')
    return null
  }
  const [lat, lon] = coords;
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OpenWeatherApiKey}&units=metric`

  try{
    const res = await fetch(url);
    const data = await res.json();
    console.debug('Data from OpenWeather:', data);

    const weather: Weather = {
      temperature: data.main.temp,
      windSpeed: data.wind.speed,
      windDir: convertDegToCompass(data.wind.deg),
      humidity: data.main.humidity,
    }

    console.debug('weather: ', weather);
    return Promise.resolve(weather)
  } 
  catch (err) {
    console.error("ERROR", err)
    return null
  }
}

export async function getFakeWeather(location: string): Promise<Weather | null> {
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