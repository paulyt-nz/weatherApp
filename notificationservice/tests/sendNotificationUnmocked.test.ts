require("dotenv").config();
import {
    WeatherNotificationSubscription,
    Weather,
} from "../../types/weatherTypes";
import {
    sendNotification,
    createNotification,
} from "../src/notificationFunctions";
import { expect, it, describe } from "@jest/globals";

describe("sendNotification - unmocked (only run occasinally)", () => {
    it("should run successfully and send an email", async () => {
        const weatherTestValues: Weather = {
            windDir: "N",
            windSpeed: 20,
            humidity: 50,
            temperature: 25,
        };
        const subcriptionTestValues: WeatherNotificationSubscription = {
            location: "Pukerua Bay",
            email: "p.d.thornton995@gmail.com",
            coords: [42, 42],
            notified_at: null,
            _id: undefined,
            constraints: {
                windDir: ["N"],
                temperature: {
                    min: 10,
                    max: 25,
                },
                windSpeed: {
                    min: 15,
                    max: 30,
                },
                humidity: {
                    min: 30,
                    max: 70,
                },
            },
        };

        const testNotification = createNotification(
            weatherTestValues,
            subcriptionTestValues
        );

        await expect(
            sendNotification(testNotification, subcriptionTestValues.email)
        ).resolves.not.toThrow();
    });
});
