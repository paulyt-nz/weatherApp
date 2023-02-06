require("dotenv").config();
import { sendNotification } from './notificationFunctions';
import { expect, jest, test } from '@jest/globals';

const MailgunApiKey = process.env.MAILGUN;

test("sendNotification runs without error", async () => {
    const notification = "Test notification message!";
    const email = "p.d.thornton995@gmail.com";

    await expect(sendNotification(notification, email)).resolves.not.toThrow();
  });