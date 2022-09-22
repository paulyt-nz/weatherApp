import { WindDirection, WeatherNotificationSubscription, WeatherConstaint, Weather } from '../common/weather'

export function createNotification(
    weather: Weather,
    request: WeatherNotificationSubscription
  ): string {
    // this is where you would create a nice email message
    // e.g. the weather is going to be x at y matching your constraints
    
    const { location } = request;
    
    const { windSpeed, windDir, humidity, temperature } = request.constraints
    
    
    let notification = `Looks like the weather at ${location} is just what you were after!`
  
    return notification
  }
  
export async function sendNotification(notification: string): Promise<boolean> {
    // this is where you would send the email
    throw new Error("Function not implemented.");
  }