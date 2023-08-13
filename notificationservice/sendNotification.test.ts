require("dotenv").config();
import { sendNotification } from './notificationFunctions';
import { expect, jest, it, describe, beforeEach, beforeAll, afterAll } from '@jest/globals';
import Mailgun from 'mailgun.js';

const mockMessagesCreate = jest.fn()

jest.mock('mailgun.js', () => {
  return jest.fn().mockImplementation(() => {
      return {
          client: jest.fn().mockReturnValue({
              messages: {
                  create: mockMessagesCreate
              }
          })
      };
  });
});

const MailgunApiKey = process.env.MAILGUN;
if (!MailgunApiKey) { throw new Error("Missing MAILGUN API key from .env vars"); }

const mailgunDomain = process.env.MAILGUN_DOMAIN;
if (!mailgunDomain) { throw new Error("MAILGUN_DOMAIN not set") }

describe("sendNotification - mocked", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it("should return a success message when run successfuly", async () => {

      const testEmail = 'test@email.com';
      const testNotification = 'This is a test!';

      await sendNotification(testNotification, testEmail);

      expect(mockMessagesCreate).toHaveBeenCalledTimes(1)
      expect(mockMessagesCreate).toHaveBeenCalledWith(mailgunDomain, {
        from: `postmaster@${mailgunDomain}`,
        to: testEmail,
        subject: 'ITS LOOKING GOOD OUT THERE!',
        text: testNotification
      });
  });

  it("should throw an error when the email fails to send", async () => {
      
      const testEmail = "test@email.com"
      const testNotification = 'This is a test!';

      mockMessagesCreate.mockImplementation(() => {
        throw new Error("Email not sent: ");
      });

      await expect(sendNotification(testNotification, testEmail)).rejects.toThrow();
  });
});


