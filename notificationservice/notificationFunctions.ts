import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const MailgunApiKey = process.env.MAILGUN;
if (!MailgunApiKey) {
  throw new Error("Missing MAILGUN API key from .env vars");
}

const MailgunDomain = process.env.MAILGUN_DOMAIN;     // domain needs to be verified in the mailgun control panel
if (!MailgunDomain) {
  throw new Error("Missing MAILGUN DOMAIN from .env vars");
} 

export function createNotification(
    weather: Weather,
    request: WeatherNotificationSubscription
  ): string {
    // this is where you would create a nice email message
    // e.g. the weather is going to be x at y matching your constraints
    
    const { location } = request;
    
    const { windSpeed, windDir, humidity, temperature } = request.constraints;
    
    
    let notification = `Looks like the weather at ${location} is just what you were after!`
  
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
    
    console.debug(messageData)
    console.debug(MailgunDomain)

    try {
      const res = await client.messages.create(MailgunDomain as string, messageData);
      console.log(res);
      return;
    } catch (err : any) {
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
    }
    return false
}