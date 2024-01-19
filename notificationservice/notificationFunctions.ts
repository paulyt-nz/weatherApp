import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../types/weatherTypes'
import formData from 'form-data';
// import Mailgun from 'mailgun.js';
import Mailjet from 'node-mailjet';
import { log } from '../common/logger';

// const MailgunApiKey = process.env.MAILGUN;
// if (!MailgunApiKey) {
//   log.error('Missing MAILGUN API key from .env vars')
//   throw new Error("Missing MAILGUN API key from .env vars");
// }

// const MailgunDomain = process.env.MAILGUN_DOMAIN;     // domain needs to be verified in the mailgun control panel
// if (!MailgunDomain) {
//   log.error('Missing MAILGUN DOMAIN from .env vars')
//   throw new Error("Missing MAILGUN DOMAIN from .env vars");
// } 

const MailjetApikeyPublic = process.env.MAILJET_APIKEY_PUBLIC;
console.log(MailjetApikeyPublic)
if (!MailjetApikeyPublic) {
  log.error('Missing MAILGUN API key from .env vars')
  throw new Error("Missing MAILJET_APIKEY_PUBLIC from .env vars");
}

const MailjetApikeyPrivate = process.env.MAILJET_APIKEY_PRIVATE; 
console.log(MailjetApikeyPrivate)    // domain needs to be verified in the mailgun control panel
if (!MailjetApikeyPrivate) {
  log.error('Missing MAILJET DOMAIN from .env vars')
  throw new Error("Missing MAILJET_APIKEY_PRIVATE from .env vars");
} 

interface Notification {
  text: string;
  html: string;
}


export function createNotification( weather: Weather, request: WeatherNotificationSubscription) : Notification {
  
   log.debug(`Creating notification for ${request.email} request ${request.location}`)
    
    const { location } = request;
    const { windSpeed, windDir, humidity, temperature } = request.constraints;
    
    // todo - make my notification message better
    let notification : Notification = {
      text: `Looks like the weather at ${location} is just what you were after!`,
      html: `skjdflakjsd`
    }
  
    return notification
}
  

export async function sendNotification(notification: Notification, email: string): Promise<void> {
  
  log.info('Connecting to Mailjet API')
  log.info(Mailjet)

  const mailjet = Mailjet.apiConnect( MailjetApikeyPublic as string, MailjetApikeyPrivate as string, { config: {}, options: {} });
  
  const messageInfo = {
    Messages: [
      {
        From: {
          Email: "p.d.thornton995@gmail.com",
          Name: "Adventure Alarm"
        },
        To: [
          {
            Email: `${email}`,
            Name: ""
          }
        ],
        Subject: "It is time to do the thing!",
        TextPart: `${notification.text}`,       // need to make a txt notification and an HTML notification
        HTMLPart: `${notification.html}`
      }
    ]
  }
  
  try {
    const result = await mailjet
      .post('send', { version: 'v3.1' })
      .request(messageInfo)

    log.info(`message sent to ${email}`)
    log.info(result.body)
  }
  catch(err) {
    log.error(`Error sendng message to ${email}`)
    log.error(err)
  }
  
  // request
  //   .then((result) => {
  //     console.log(result.body)
  //     })
  //   .catch((err) => {
  //     console.log(err.statusCode)
  //     })
    // const mailgun = new Mailgun(formData);
    // const client = mailgun.client({username: 'WeatherApp', key: MailgunApiKey as string});
    
    // const messageData = {
    //   from: `postmaster@${MailgunDomain as string}`,                // from email needs to be verified in the mailgun control panel
    //   to: email,                                          // can only send to p.d.thornton995 at this stage
    //   subject: 'ITS LOOKING GOOD OUT THERE!',
    //   text: notification
    // };

    // log.debug(`Sending notification to ${email}`)

    // try {
    //   const res = await client.messages.create(MailgunDomain as string, messageData);
    //   log.debug('Mailgun response: ', res);
    //   return;
    // } catch (err : any) {
    //   log.error('Email not sent: ', err);
    //   throw new Error("Email not sent: ", err);
    // }
}


export function checkNotifiedToday(request: WeatherNotificationSubscription): boolean {
    if (request.notified_at) {
      const time24HoursAgo = Date.now() - 24 * 60 * 60 * 1000 
      const timeNotified = request.notified_at.getTime()
      
      if (timeNotified > time24HoursAgo) {
        return true
      } 
      log.info("Notification message has already been sent today")
    }
    
    return false
}