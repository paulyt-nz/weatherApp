import { setTimeout } from "timers/promises";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { Db, MongoClient } from 'mongodb';
import { getRequests, getWeather, checkWeatherMatchesConstraints } from './weatherFunctions';
import { createNotification, sendNotification } from './notificationFunctions';


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
