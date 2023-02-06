import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'
import formData from 'form-data';
import Mailgun from 'mailgun.js';

const MailgunApiKey = process.env.MAILGUN;
if (!MailgunApiKey) {
  throw new Error("Missing MAILGUN API key from .env vars");
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
    const DOMAIN = 'YOUR_DOMAIN_NAME';                        // change this to see if it makes any difference
    
    const mailgun = new Mailgun(formData);
    const client = mailgun.client({username: 'WeatherApp', key: MailgunApiKey as string});
    
    const messageData = {
      from: 'Excited User <me@samples.mailgun.org>',          // change this and see if it makes any difference
      to: email,
      subject: 'ITS LOOKING GOOD OUT THERE!',
      text: notification
    };
    
    client.messages.create(DOMAIN, messageData)
     .then((res) => {
       console.log(res);
     })
     .catch((err) => {
      throw new Error("Email not sent: ", err);
     });
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