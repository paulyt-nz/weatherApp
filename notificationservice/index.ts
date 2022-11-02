import { setTimeout } from "timers/promises";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import { Db, MongoClient } from 'mongodb';
import { getRequests, getWeather, checkWeatherMatchesConstraints } from './weatherFunctions';
import { createNotification, sendNotification, checkNotifiedToday } from './notificationFunctions';
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
    const timeNow = Date.now()

    for (const request of requests) {
      if (checkNotifiedToday(request, timeNow)) {
        console.debug(`Notified today for ${request.email} request ${request.location}`)
        continue;
      }
      
      console.debug(`Checking weather for ${request.email} request ${request.location}`)
      const weather = await getWeather(request.location);
      console.debug(weather)

      if (!weather) {
        console.error(`No weather found for ${request.location}`);
        continue;
      }

      if (checkWeatherMatchesConstraints(request.constraints, weather)) {
        const notification = createNotification(weather, request);
        console.debug(`Sending: ${notification}`)
        await sendNotification(notification);
        await db.collection('subs').updateOne({_id: request._id}, { $set: {notified_at : timeNow}})
      }
    }

    await setTimeout(5000);
  }
}

connectToDB().then((db) => poll(db));
