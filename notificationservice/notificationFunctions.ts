import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../types/weatherTypes'
import Mailjet from 'node-mailjet';
import { log } from '../common/logger';


const MailjetApikeyPublic = process.env.MAILJET_APIKEY_PUBLIC;
console.log(MailjetApikeyPublic)
if (!MailjetApikeyPublic) {
  log.error('Missing MAILGUN API key from .env vars')
  throw new Error("Missing MAILJET_APIKEY_PUBLIC from .env vars");
}

const MailjetApikeyPrivate = process.env.MAILJET_APIKEY_PRIVATE; 
console.log(MailjetApikeyPrivate)  
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
    const constraints = request.constraints;

    
    let notification : Notification = {
      text: `At Adeventure Alarm we believe that life is about doing. 
        About taking action. 
        About jumping at opportunities when they appear.
        
        And right now the weather is giving you an opportunity...
        
        GO DO THE THING 
        
        Current weather at ${location}: ${weather.windDir}, ${weather.windSpeed}, ${weather.temperature}, ${weather.humidity}
        Your constraints: ${constraints.windDir}, ${constraints.windSpeed}, ${constraints.temperature}, ${constraints.humidity}`,
      html: `<h3>At Adeventure Alarm we believe that life is about doing.</h3> 
      <h3>About taking action.</h3> 
      <h3>About jumping at opportunities when they appear.</h3>
      
      <h3>And right now the weather is giving you an opportunity...</h3>
      
      <h2>GO DO THE THING!</h2>
      
      <p>Current weather at ${location}: ${weather.windDir}, ${weather.windSpeed}, ${weather.temperature}, ${weather.humidity}</p>
      <p>Your constraints: ${constraints.windDir}, ${constraints.windSpeed}, ${constraints.temperature}, ${constraints.humidity}</p>`
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
        TextPart: `${notification.text}`,       
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