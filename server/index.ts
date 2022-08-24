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

app.post("/api/notificationSub", async (req, res) => {
  try {
    await client.connect();

    const db = client.db();
    // todo
    console.log(req.body)
    const notificationRequest = req.body as WeatherNotificationSubscription;
    // validate the request
    // store it in the database in the subs collection

    // after validation create a document to then insert
    const subscriptionDoc: WeatherNotificationSubscription = {
      email: notificationRequest.email,
      location: notificationRequest.location,
      constraints: notificationRequest.constraints,
    };
    await db.collection("subs").insertOne(subscriptionDoc);

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
