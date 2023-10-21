import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../types/weatherTypes'
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { log } from '../common/logger';

const MailgunApiKey = process.env.MAILGUN;
if (!MailgunApiKey) {
  log.error('Missing MAILGUN API key from .env vars')
  throw new Error("Missing MAILGUN API key from .env vars");
}

const MailgunDomain = process.env.MAILGUN_DOMAIN;     // domain needs to be verified in the mailgun control panel
if (!MailgunDomain) {
  log.error('Missing MAILGUN DOMAIN from .env vars')
  throw new Error("Missing MAILGUN DOMAIN from .env vars");
} 

export function createNotification(
    weather: Weather,
    request: WeatherNotificationSubscription
  ): string {
   log.debug(`Creating notification for ${request.email} request ${request.location}`)
    
    const { location } = request;
    const { windSpeed, windDir, humidity, temperature } = request.constraints;
    
    // todo - make my notification message better
    let notification = `Looks like the weather at ${location} is just what you were after!`;
  
    return notification
}
  
export async function sendNotification(notification: string, email: string): Promise<void> {
       
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({username: 'WeatherApp', key: MailgunApiKey as string});
    
    const messageData = {
      from: `postmaster@${MailgunDomain as string}`,                // from email needs to be verified in the mailgun control panel
      to: email,                                          // can only send to p.d.thornton995 at this stage
      subject: 'ITS LOOKING GOOD OUT THERE!',
      text: notification
    };

    log.debug(`Sending notification to ${email}`)

    try {
      const res = await client.messages.create(MailgunDomain as string, messageData);
      log.debug('Mailgun response: ', res);
      return;
    } catch (err : any) {
      log.error('Email not sent: ', err);
      throw new Error("Email not sent: ", err);
    }
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