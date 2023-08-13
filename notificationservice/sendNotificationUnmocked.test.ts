require("dotenv").config();
import { sendNotification } from './notificationFunctions';
import { expect, it, describe } from '@jest/globals';

describe.skip("sendNotification - unmocked (only run occasinally)", () => {

    it("should run successfully and send an email", async () => {

        const notification = "Test notification message!";
        const email = "p.d.thornton995@gmail.com";

        await expect(sendNotification(notification, email)).resolves.not.toThrow();
    });
});