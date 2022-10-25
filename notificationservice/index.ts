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
  while (true) {
    const requests = await getRequests(db);

    console.debug(requests)
    for (const request of requests) {
      console.debug(`Checking weather for ${request.email} request ${request.location}`)

      // if already notified within 24 hours skip to next request
      if (request.notified_at) {
        let now = new Date();
        let timeOneDayAgo = now.getDate() - 24 * 60 * 60 * 1000 
        
        let timeNotified = request.notified_at?.getTime()

        if (timeNotified < timeOneDayAgo) {
          continue
        } 
      }

      const weather = await getWeather(request.location);
      console.debug(weather)
      if (!weather) {
        console.error(`No weather found for ${request.location}`);
        continue;
      }

      if (checkWeatherMatchesConstraints(request.constraints, weather)) {
        const notification = createNotification(weather, request);
        console.debug(`Sending ${notification}`)
        await sendNotification(notification);
        // todo mark as notified
      }
    }

    await setTimeout(5000);
  }
}

connectToDB().then((db) => poll(db));
