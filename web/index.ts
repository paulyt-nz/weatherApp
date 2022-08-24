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
  const location = document.getElementById(
    "location"
  ) as HTMLInputElement | null;
  if (!location) {
    window.alert("Missing location!");
    return;
  }

  const request: WeatherNotificationSubscription = {
    email: email.value,
    location: location.value,
    constraints: {} as any, // todo fill in the constraints
  };

  try {
    const response = await fetch("./api/notificationSub", {
      body: JSON.stringify(request),
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    window.alert("Congrats you are now subscribed!");
  } catch (error) {
    console.error(error);
    window.alert(error.message);
  }
});
