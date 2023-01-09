require("dotenv").config();

import express from "express";

import { client } from "./db/db";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint } from '../common/weather'
import fetch from 'node-fetch';

const port = process.env.PORT ?? 3000;
const MapBoxApiKey = process.env.MAPBOX;

if (!MapBoxApiKey) {
  throw new Error("Missing MAPBOX API key from .env vars");
}

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));

app.get("/api", (req, res) => {
  res.send("Welcome to the weather!");
});

// post a notification request to the server

function constraintsValid(constraints: Partial<WeatherConstaint>): boolean {
  // todo more checks
  if (constraints.windSpeed) {
    if (!constraints.windSpeed.min && !constraints.windSpeed.max) {
      return false;
    }
  }
  if (constraints.temperature) {
    if (!constraints.temperature.min && !constraints.temperature.max) {
      return false;
    }
  }
  if (constraints.humidity) {
    if (!constraints.humidity.min && !constraints.humidity.max) {
      return false;
    }
  }
  return true;
}

async function convertLocationToCoords (location: string): Promise<number[] | null> {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MapBoxApiKey}`

  console.debug(url)

  try {
      const res = await fetch(url)
      console.debug("res:  ", res)
      const data = await res.json() as any
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


app.get("/api/coords", async (req, res) => {
  console.debug('hitting /api/coords')
  console.debug('req.query: ', req.query)
  const location = req.query.location as string;
  console.debug("location: ", location)
  if (!location) {
    res.status(400).send("Missing location");
    return;
  }

  // try {
  const coords = await convertLocationToCoords(location);
  res.json(coords);
  // }
  // catch (err) {
  //   res.status(400).send("Could not find location")
  // }
});

app.post("/api/notificationSub", async (req, res) => {
  try {
    await client.connect();

    const db = client.db();
    // todo
    console.log(req.body);
    const { location, constraints, email, coords } = req.body;

    // validate the request
    if (!location || typeof location !== "string") {
      res.status(400).send("Missing location");
      return;
    }

    if (!coords) {
      res.status(400).send("Missing coords");
      return;
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      res.status(400).send("Missing email");
      return;
    }

    if (
      !constraints ||
      typeof constraints !== "object" ||
      !constraintsValid(constraints)
    ) {
      res.status(400).send("Missing constraints");
      return;
    }

    const notificationRequest: WeatherNotificationSubscription = {
      email: email,
      location: location,
      coords: coords,
      constraints: constraints,
      notified_at: null,
      _id: undefined,
    };

    // store it in the database in the subs collection

    // after validation create a document to then insert

    await db.collection("subs").insertOne(notificationRequest);

    res.send("Subscribed!");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.use(express.static("../web"));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
