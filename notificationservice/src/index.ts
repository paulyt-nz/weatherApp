require("dotenv").config();
import { setTimeout } from "timers/promises";
import { Db, MongoClient } from "mongodb";
import {
    getRequests,
    getWeather,
    checkWeatherMatchesConstraints,
} from "./weatherFunctions";
import {
    createNotification,
    sendNotification,
    checkNotifiedToday,
} from "./notificationFunctions";
import { log } from "../../common/logger";

async function connectToDB(): Promise<Db> {
    log.debug("Setting upconnection to Mongo");
    const uri = process.env.MONGO_DB || "mongodb://127.0.0.1/weather";

    if (!uri)
        throw new Error("Missing MONGO_DB connection string from .env vars");

    const client = new MongoClient(uri);

    try {
        log.info("Connecting to Mongo");
        await client.connect();
        return client.db();
    } catch (err) {
        log.warn("Connecting to mongo failed");
        log.debug(err);
        throw err;
    }
}

async function poll(db: Db) {
    log.info("Starting polling for requests");

    while (true) {
        const requests = await getRequests(db);

        for (const request of requests) {
            log.debug(
                `Checking weather for ${request.email} request ${request.location}`
            );
            log.debug(`request:  ${request}`);

            if (checkNotifiedToday(request)) {
                log.debug(
                    `Notified today for ${request.email} request ${request.location}`
                );
                continue;
            }

            const weather = await getWeather(request.coords);
            log.debug(`Weather at ${request.location}: `, weather);

            if (!weather) {
                log.error(`No weather found for ${request.location}`);
                continue;
            }

            if (checkWeatherMatchesConstraints(request.constraints, weather)) {
                const notification = createNotification(weather, request);
                log.debug(`Sending: ${notification}`);
                await sendNotification(notification, request.email);

                let timeNotified = new Date();
                await db
                    .collection("subs")
                    .updateOne(
                        { _id: request._id },
                        { $set: { notified_at: timeNotified } }
                    );
            } else log.debug(`No match`);
        }
        log.info(
            "******************  Finished polling for requests  **********************"
        );
        await setTimeout(10000);
    }
}

connectToDB().then((db) => poll(db));
