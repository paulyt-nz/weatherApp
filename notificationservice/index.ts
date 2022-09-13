import { setTimeout } from "timers/promises";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { Db, MongoClient } from 'mongodb';

async function connectToDB(): Promise<Db> {
  const uri = process.env.MONGO_DB;
  if (!uri) throw new Error("Missing MONGO_DB connection string from .env vars");

  const client = new MongoClient(uri);

  try {
    await client.connect()
    return client.db()
  }
  catch (err) {
    console.log(err)
    throw err
  }
}

async function getRequests(db: Db): Promise<WeatherNotificationSubscription[]> {
  // todo check database for requests
  // todo support pagination or streaming
  // todo look into what a generic is
  const collection = db.collection<WeatherNotificationSubscription>('subs');

  return collection.find().toArray()
}

async function getWeather(location: string): Promise<Weather | null> {
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

function createNotification(
  weather: Weather,
  request: WeatherNotificationSubscription
): string {
  // this is where you would create a nice email message
  // e.g. the weather is going to be x at y matching your constraints
  
  const { location } = request;

  const { windSpeed, windDir, humidity, temperature } = request.constraints


  let notification = `Looks like the weather at ${location} is just what you were after!`

  return notification
}

async function sendNotification(notification: string): Promise<boolean> {
  // this is where you would send the email
  throw new Error("Function not implemented.");
}


export function checkOneWeatherWithConstraints(constraintValueMin: number, constraintValueMax: number, weatherValue: number ): boolean {
  if (weatherValue > constraintValueMin && weatherValue < constraintValueMax) {
    return true
  } else {
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
          return false;
        }
      }
      if (constraints.windSpeed.max !== undefined) {
        if(weather.windSpeed < constraints.windSpeed.max) {
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
        if(weather.temperature < constraints.temperature.max) {
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
        if(weather.humidity < constraints.humidity.max) {
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

async function poll(db: Db) {
  while (true) {
    const requests = await getRequests(db);
    for (const request of requests) {
      const weather = await getWeather(request.location);
      if (!weather) {
        console.error(`No weather found for ${request.location}`);
        continue;
      }

      if (checkWeatherMatchesConstraints(request.constraints, weather)) {
        const notification = createNotification(weather, request);
        await sendNotification(notification);
      }
    }

    await setTimeout(5000);
  }
}

connectToDB().then((db) => poll(db));
