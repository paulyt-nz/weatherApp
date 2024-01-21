require("dotenv").config();
import type { WeatherNotificationSubscription, WindDirection } from '../../../../types/weatherTypes';

const apiAddress = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8081/"

export async function sendSubscriptionRequest(request : WeatherNotificationSubscription) {
  //const apiAddress = process.env.BACKEND_API_URL || "http://localhost:8081"
  console.log("sending request: ", request)
  console.log("to: ", `${apiAddress}/api/notificationSub`)
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
  } else {
      throw new Error("An unexpected error occurred");
  }
  }
}
 

export async function getCoordsFromLocation(location: string) : Promise<number[]> {
  //const apiAddress = process.env.BACKEND_API_URL || "http://localhost:8081"

  console.log("apiAddress: ", apiAddress)
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




