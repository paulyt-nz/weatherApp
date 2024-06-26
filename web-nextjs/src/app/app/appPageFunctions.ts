import type { WeatherNotificationSubscription } from '../../../../types/weatherTypes';

const apiAddress = "https://weather-app-server-2k0c.onrender.com" || 
  "http://localhost:8081"

  
export async function sendSubscriptionRequest(request : WeatherNotificationSubscription) {
  console.log("sending request: ", request)

  try {
    const response = await fetch(`${apiAddress}/api/notificationSub`, {
      body: JSON.stringify(request),
      method: "POST",
      headers: {
        "content-type": "application/JSON"
      }
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } 
    else {
      throw new Error("An unexpected error occurred");
    }
  }
}
 

export async function getCoordsFromLocation(location: string) : Promise<number[]> {
  console.log('getting coords from location')

  try {     
    const response = await fetch(`${apiAddress}/api/coords?location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const coords = await response.json();
    
    return coords;
  } 
  catch (err) {
    throw new Error("Could not find any coordinates for that location!");
  }
}


export function checkUserData(request : WeatherNotificationSubscription) {
  if (!request.email || request.email === "") { 
    throw new Error("Missing email address!") 
  }
  if (!request.location || request.location === "") { 
    throw new Error("Missing location!") 
  }
  if (!request.coords || request.coords.length !== 2) {  
    throw new Error("Location not found!") 
  }
}


export async function sendWakeupCall() {
    console.log("sending wakeup call")
    const res = await fetch(`${apiAddress}/api/wakeup`);
    const result = await res.json();
    console.log(result);
  }




