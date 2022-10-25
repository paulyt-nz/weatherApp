import { setTimeout } from "timers/promises";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { Db, MongoClient } from 'mongodb';
import { getRequests, getWeather, checkWeatherMatchesConstraints } from './weatherFunctions';
import { createNotification, sendNotification } from './notificationFunctions';
require("dotenv").config();



async function connectToDB(): Promise<Db> {
  const uri = process.env.MONGO_DB;
  if (!uri) throw new Error("Missing MONGO_DB connection string from .env vars");

  const client = new MongoClient(uri);

  try {
    console.info('Connecting to Mongo')
    await client.connect()
    return client.db()
  }
  catch (err) {
    console.warn('Connecting to mongo failed')
    console.log(err)
    throw err
  }
}

async function poll(db: Db) {
  console.info('Starting polling for requests')
  // TODO - add in a filter for notifications that have been sent out that day
  while (true) {
    const requests = await getRequests(db);
    
    console.debug(requests)
    for (const request of requests) {
      console.debug(`Checking weather for ${request.email} request ${request.location}`)
      const weather = await getWeather(request.location);
      console.debug(weather)
      if (!weather) {
        console.error(`No weather found for ${request.location}`);
        continue;
      }

      if (checkWeatherMatchesConstraints(request.constraints, weather)) {
        // TODO - an another check in here for notifications that have already gone out
        const notification = createNotification(weather, request);
        console.debug(`Sending: ${notification}`)
        await sendNotification(notification);
        // todo mark as notified
      }
    }

    await setTimeout(5000);
  }
}

connectToDB().then((db) => poll(db));
