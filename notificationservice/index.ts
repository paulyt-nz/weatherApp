import { setTimeout } from "timers/promises";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { MongoClient } from 'mongodb';

async function connectToDB() {
  const uri = process.env.MONGO_DB;
  if (!uri) throw new Error("Missing MONGO_DB connection string from .env vars");

  const client = new MongoClient(uri);

  try {
    await client.connect()
    console.log('Connected to database')
  }
  catch (err) {
    console.log(err)
    throw err
  }
  return client
}

async function getRequests(): Promise<WeatherNotificationSubscription[]> {
  // todo check database for requests
  // todo support pagination or streaming


  // need to pull the request out of the database to an array and return the array

  return [];
}

function getWeather(location: string): Promise<Weather | null> {
  throw new Error("Function not implemented.");
}

function createNotification(
  weather: Weather,
  request: WeatherNotificationSubscription
): string {
  // this is where you would create a nice email message
  // e.g. the weather is going to be x at y matching your constraints
  throw new Error("Function not implemented.");
}

async function sendNotification(notification: string): Promise<boolean> {
  // this is where you would send the email
  throw new Error("Function not implemented.");
}

function checkWeatherMatchesConstraints(
  constraints: WeatherConstaint,
  weather: Weather
): boolean {
  // todo check if weather matches
  throw new Error("Function not implemented.");
}

async function poll() {
  while (true) {
    const requests = await getRequests();
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

connectToDB().then(() => poll());
