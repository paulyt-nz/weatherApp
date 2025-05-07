require("dotenv").config();
import Mailjet from "node-mailjet";
import { log } from "../../common/logger";

const MailjetApikeyPublic = process.env.MAILJET_APIKEY_PUBLIC;
if (!MailjetApikeyPublic) {
    log.error("Missing MAILJET_APIKEY_PUBLIC from .env vars");
    throw new Error("Missing MAILGUN API key from .env vars");
}

const MailjetApikeyPrivate = process.env.MAILJET_APIKEY_PRIVATE;
if (!MailjetApikeyPrivate) {
    log.error("Missing MAILGUN DOMAIN from .env vars");
    throw new Error("Missing MAILJET_APIKEY_PRIVATE from .env vars");
}

const mailjet = Mailjet.apiConnect(MailjetApikeyPublic, MailjetApikeyPrivate, {
    config: {},
    options: {},
});

const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
        {
            From: {
                Email: "p.d.thornton995@gmail.com",
                Name: "Adventure Alarm",
            },
            To: [
                {
                    Email: "paul@cloud.co.nz",
                    Name: "passenger 1",
                },
            ],
            Subject: "Your email flight plan!",
            TextPart:
                "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
            HTMLPart:
                '<h3>Dear passenger 1, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!</h3><br />May the delivery force be with you!',
        },
    ],
});

request
    .then((result) => {
        console.log(result.body);
    })
    .catch((err) => {
        console.log(err.statusCode);
    });
