import type { WindDirection, WeatherNotificationSubscription, WeatherConstaint } from '../common/weather'
// require("dotenv").config();

console.log('index.js running')

//const MapBoxApiKey = process.env.MAPBOX;
const MapBoxApiKey = 'pk.eyJ1IjoicHVrZXJkIiwiYSI6ImNsNXU2MnJ5eTBmejUzZm51eWkxOHY0dmYifQ.9YanyzIX5CpaG5f4e9ZPLw';
if (!MapBoxApiKey) {
  throw new Error("Missing MAPBOX API key from .env vars");
}

export async function convertLocationToCoords (location: string): Promise<number[] | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MapBoxApiKey}`
  
    try {
        const res = await fetch(url)
        console.debug("res:  ", res)
        const data = await res.json()
        console.debug("data:  ",data)
  
        const [lon, lat] : number[] = data.features[0].center
        console.debug('lat: ', lat, 'long: ', lon)
  
        return Promise.resolve([lat, lon])
    }
    catch (err) {
      console.error('ERROR', err)
      return null
    }
  }

const submitBtn = document.getElementById("submit") as HTMLButtonElement | null;
if (!submitBtn) throw new Error("wtf");

submitBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  // to grab values in the form
  // and then send them off to our API

  const email = document.getElementById("email") as HTMLInputElement | null;
  if (!email || !email.value) {
    window.alert("Missing email address!");
    return;
  }
  const location = document.getElementById("location") as HTMLInputElement | null;
  if (!location || !location.value) {
    window.alert("Missing location!");
    return;
  }

  const coords = await convertLocationToCoords(location.value)
  if (!coords) {
      window.alert("Sorry could not find your location! Please try something else.")
      return
  }
  
  const windDir = document.getElementById("windDirection") as HTMLSelectElement | null;
  if (!windDir || !windDir.selectedOptions) {
    window.alert('Missing Wind Direction')
    return;
  }

  const selectedWindDirs: WindDirection[] = []
  for (let i = 0; i < windDir.selectedOptions.length; i++) {
    const element = windDir.selectedOptions[i];

    selectedWindDirs.push(element.value as WindDirection)
  }

  const windSpeedMin = document.getElementById("windSpeedMin") as HTMLSelectElement | null;
  if (!windSpeedMin || !windSpeedMin.value) {
    window.alert('Missing Wind Speed Minimum')
    return;
  }
  const windSpeedMax = document.getElementById("windSpeedMax") as HTMLSelectElement | null;
  if (!windSpeedMax || !windSpeedMax.value) {
    window.alert('Missing Wind Speed Maximum')
    return;
  }

  const tempMin = document.getElementById("tempMin") as HTMLSelectElement | null;
  if (!tempMin || !tempMin.value) {
    window.alert('Missing Temperature Minimum')
    return;
  }
  const tempMax = document.getElementById("tempMax") as HTMLSelectElement | null;
  if (!tempMax || !tempMax.value) {
    window.alert('Missing Temperature Maximum')
    return;
  }

  const humidityMin = document.getElementById("humidityMin") as HTMLSelectElement | null;
  if (!humidityMin || !humidityMin.value) {
    window.alert('Missing Humidity Minimum')
    return;
  }
  const humidityMax = document.getElementById("humidityMax") as HTMLSelectElement | null;
  if (!humidityMax || !humidityMax.value) {
    window.alert('Missing Humidity Maximum')
    return;
  }


  const request: WeatherNotificationSubscription = {
    email: email.value,
    location: location.value,
    coords: coords,
    notified_at: null,
    _id: undefined,
    constraints: {
      windDir: selectedWindDirs,
      windSpeed: {
        min: parseInt(windSpeedMin.value),
        max: parseInt(windSpeedMax.value)
      },
      temperature: {
        min: parseInt(tempMin.value),
        max: parseInt(tempMax.value)
      },
      humidity: {
        min: parseInt(humidityMin.value),
        max: parseInt(humidityMax.value)
      },
    },
  };

  try {
    const response = await fetch("./api/notificationSub", {
      body: JSON.stringify(request),
      method: "POST",
      headers: {
        "content-type": "application/JSON"
      }
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    window.alert("Congrats you are now subscribed!");
  } catch (error) {
    console.error(error);
    window.alert((error as any)?.message);
  }
});
