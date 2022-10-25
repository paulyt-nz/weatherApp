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
  
export async function sendNotification(notification: string): Promise<boolean | void> {
    // this is where you would send the email

    // For now we will just print notification to the console so I can see it is working
    console.log('******************************************')
    console.log('******************************************')
    console.log('******************************************')
    console.log(notification)
    console.log('******************************************')
    console.log('******************************************')
    console.log('******************************************')

   // throw new Error("Function not implemented.");
  }