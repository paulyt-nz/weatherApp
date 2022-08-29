require("dotenv").config();

import express from "express";

import { client } from "./db/db";

type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

type WeatherConstaint = {
  windDir: WindDirection[];

  windSpeed?: { min?: number; max?: number };

  temperature?: { min?: number; max?: number };

  humidity?: { min?: number; max?: number };
};

type WeatherNotificationSubscription = {
  location: string;

  constraints: WeatherConstaint;

  email: string;
};

const port = process.env.PORT ?? 3000;

const app = express();

app.use(express.json());

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

app.post("/api/notificationSub", async (req, res) => {
  try {
    await client.connect();

    const db = client.db();
    // todo
    console.log(req.body);
    const { location, constraints, email } = req.body;

    // validate the request
    if (!location || typeof location !== "string") {
      res.status(400).send("Missing location");
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
      constraints: constraints,
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
