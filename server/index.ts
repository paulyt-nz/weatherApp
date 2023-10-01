require("dotenv").config();

import express from "express";
import  cors  from "cors";
import { client } from "./db/db";
import { WindDirection, WeatherNotificationSubscription, WeatherConstaint } from '../common/weatherTypes'
import { convertLocationToCoords } from "./location";
import { log } from "../common/logger";

const port = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());
app.use(cors())


function areConstraintsValid(constraints: Partial<WeatherConstaint>): boolean {
  log.debug("Validating constraints")
  log.debug("Constraints: ", constraints)

  if (constraints.windDir && constraints.windDir.length) {
    const validWindDirections : WindDirection[] = [ "N", "NE", "E", "SE", "S", "SW", "W", "NW" ]

    for (let dir of constraints.windDir) {
      if (!validWindDirections.includes(dir)) {
        log.error("Invalid wind direction")
        return false;
      }
    }
  }

  if (constraints.windSpeed) {
    if (!constraints.windSpeed.min && !constraints.windSpeed.max) {
      log.error("Invalid windSpeed constraints")
      return false;
    }
    if (constraints.windSpeed.min && constraints.windSpeed.max) {
      if (constraints.windSpeed.min > constraints.windSpeed.max) {
        log.error("Wind speed min is greater than max")
        return false;
      }
    }
  }

  if (constraints.temperature) {
    if (!constraints.temperature.min && !constraints.temperature.max) {
      log.error("Invalid temperature constraints")
      return false;
    }
    if (constraints.temperature.min && constraints.temperature.max) {
      if (constraints.temperature.min > constraints.temperature.max) {
        log.error("Temperature min is greater than max")
        return false;
      }
    }
  }

  if (constraints.humidity) {
    if (!constraints.humidity.min && !constraints.humidity.max) {
      log.error("Invalid humidity constraints")
      return false;
    }
    if (constraints.humidity.min && constraints.humidity.max) {
      if (constraints.humidity.min > constraints.humidity.max) {
        log.error("Humidity min is greater than max")
        return false;
      }
    }
  }
  return true;
}


app.get("/api/coords", async (req, res) => {
  log.debug('Request for coordinates received')

  const location = req.query.location;

  log.debug("location: ", location);

  if (!location) {
    log.error("Missing location parameter");
    res.status(400).send("Missing location");
    return;
  }
  
  if (typeof location !== "string") {
    log.error("Invalid location parameter - not a string");
    res.status(400).send("Invalid location parameter");
    return;
  }

  try {
    log.debug('Calling convertLocationToCoords()')

    const coords = await convertLocationToCoords(location);

    log.debug("coords", coords)
    res.json(coords);
  } 
  catch (error) {
    log.error("Error converting location to coords: ", error);
    res.status(500).send(error);
  }
});


app.post("/api/notificationSub", async (req, res) => {
  log.debug("Request for notification subscription received")
  log.debug("Connecting to database")
  try {
    await client.connect();
    const db = client.db();
    
    const { location, constraints, email, coords } = req.body;
    log.debug("Validating request body")

    if (!location || typeof location !== "string") {
      log.error("Invalid location")
      res.status(400).send("Invalid location");
      return;
    }

    if (!coords || !Array.isArray(coords)) {
      log.error("Invalid coords")
      res.status(400).send("Invalid coords");
      return;
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      log.error("Invalid email")
      res.status(400).send("Invalid email");
      return;
    }

    if ( !constraints || typeof constraints !== "object" || !areConstraintsValid(constraints)) {
      log.error("Invalid constraints")
      res.status(400).send("Invalid constraints");
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

    log.debug("Inserting notification request into database")

    await db.collection("subs").insertOne(notificationRequest);

    log.debug("Notification request successfully inserted into database")
    res.send("Subscribed!");
  } 
  catch (error) {
    log.debug(error);
    res.sendStatus(500).send("There has been an error saving your subscription. We are looking into it 😀");
  }
});

// Front end has been migrated to Next JS app located in ./web-nextjs
// Old front end code found here:
// app.use(express.static("../web"));

app.listen(port, () => {
  log.debug("Starting server");
  log.debug(`Server started on port ${port}`);
});
