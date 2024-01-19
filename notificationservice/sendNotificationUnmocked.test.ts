require("dotenv").config();
import { sendNotification } from './notificationFunctions';
import { expect, it, describe } from '@jest/globals';

describe("sendNotification - unmocked (only run occasinally)", () => {

    it("should run successfully and send an email", async () => {

        const notification = {
            text: "You have passed the test",
            html: "You have passed the test, but with html"
        }
        const email = "paul@cloud.co.nz";

        await expect(sendNotification(notification, email)).resolves.not.toThrow();
    });
});