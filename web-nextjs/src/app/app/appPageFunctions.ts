import type { WeatherNotificationSubscription, WindDirection } from '../../../../common/weather'


export async function sendSubscriptionRequest(request : WeatherNotificationSubscription) {
  console.log("sending request: ", request)
  try {
    const response = await fetch("http://localhost:8081/api/notificationSub", {
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
      window.alert(error.message);
  } else {
      window.alert("An unexpected error occurred");
  }
  }
}
 

export async function getCoordsFromLocation(location: string) : Promise<number[]> {
  console.log('getting coords from location')
  try {     
    const response = await fetch(`http://localhost:8081/api/coords?location=${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const coords = await response.json();
    
    return coords;
  } 
  catch (err) {
    window.alert("Sorry could not find your location! Please try something else.")
    console.debug(err)
    throw new Error("Could not find location!");
  }
}


export function checkUserData(request : WeatherNotificationSubscription) {
  if (!request.email || request.email === "") { 
    window.alert("Missing email address!") 
    return;
  }
  if (!request.location || request.location === "") { 
    window.alert("Missing location!") 
    return;
  }
  if (!request.coords || request.coords.length !== 2) {  
    window.alert("Location not found!") 
    return;
  }
  // check Wind dir somehow
}


export function checkConstraints(request : WeatherNotificationSubscription) {
  // validate contraint data here
  //    - make sure that min < max for all of them
  //    - make sure that at least one type of constraint is present
}


