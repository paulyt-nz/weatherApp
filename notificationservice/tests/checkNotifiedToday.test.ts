require("dotenv").config();
import { checkNotifiedToday } from "../src/notificationFunctions";
import { expect, jest, test } from "@jest/globals";
import { WeatherNotificationSubscription } from "../../types/weatherTypes";

test("test if time notified_at is within the last 24 hours", () => {
    const request: WeatherNotificationSubscription = {
        location: "alskdjflkajsdf",
        email: "alskdjflkajsdf",
        coords: [0, 0],
        constraints: {
            windDir: ["N"],
            windSpeed: { min: 10, max: 20 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 10, max: 20 },
        },
        notified_at: new Date(1989, 6, 7),
        _id: undefined,
    };

    jest.useFakeTimers();
    jest.setSystemTime(new Date(615812400000)); // 23 hours after the date in request.notified_at

    const result = checkNotifiedToday(request);

    expect(result).toBe(true);
});

test("test if time notified_at is outside the last 24 hours", () => {
    const request: WeatherNotificationSubscription = {
        location: "alskdjflkajsdf",
        email: "alskdjflkajsdf",
        coords: [0, 0],
        constraints: {
            windDir: ["N"],
            windSpeed: { min: 10, max: 20 },
            temperature: { min: 10, max: 20 },
            humidity: { min: 10, max: 20 },
        },
        notified_at: new Date(1989, 6, 7),
        _id: undefined,
    };

    jest.useFakeTimers();
    jest.setSystemTime(new Date(615819600000)); // 25 hours after the date in request.notified_at

    const result = checkNotifiedToday(request);

    expect(result).toBe(false);
});
