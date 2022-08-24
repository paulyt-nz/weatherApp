import { setTimeout } from "timers/promises";

type WindDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

type WeatherConstaint = {
  windDir: WindDirection[];

  windSpeed?: { min?: number; max?: number };

  temperature?: { min?: number; max?: number };

  humidity?: { min?: number; max?: number };
};

type WeatherNotificationSubscription = {
  location: string;

  constraints: WeatherConstaint;

  email: string;
};

type Weather = {
  windSpeed: number;
  temperature: number;
  humidity: number;
  windDir: WindDirection;
};

async function connectToDB() {
  // todo
}

async function getRequests(): Promise<WeatherNotificationSubscription[]> {
  // todo check database for requests
  // todo support pagination or streaming
  return [];
}

function getWeather(location: string): Promise<Weather | null> {
  throw new Error("Function not implemented.");
}

function createNotification(
  weather: Weather,
  request: WeatherNotificationSubscription
): string {
  // this is where you would create a nice email message
  // e.g. the weather is going to be x at y matching your constraints
  throw new Error("Function not implemented.");
}

async function sendNotification(notification: string): Promise<boolean> {
  // this is where you would send the email
  throw new Error("Function not implemented.");
}

function checkWeatherMatchesConstraints(
  constraints: WeatherConstaint,
  weather: Weather
): boolean {
  // todo check if weather matches
  throw new Error("Function not implemented.");
}

async function poll() {
  while (true) {
    const requests = await getRequests();
    for (const request of requests) {
      const weather = await getWeather(request.location);
      if (!weather) {
        console.error(`No weather found for ${request.location}`);
        continue;
      }

      if (checkWeatherMatchesConstraints(request.constraints, weather)) {
        const notification = createNotification(weather, request);
        await sendNotification(notification);
      }
    }

    await setTimeout(5000);
  }
}

connectToDB().then(() => poll());
