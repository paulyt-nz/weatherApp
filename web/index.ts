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
  const location = document.getElementById("location") as HTMLInputElement | null;
  if (!location || !location.value) {
    window.alert("Missing location!");
    return;
  }

  const windDir = document.getElementById("windDirection") as HTMLSelectElement | null;
  if(!windDir || !windDir.selectedOptions) {
    window.alert('Missing Wind Direction')
    return;
  }

  const selectedWindDirs: WindDirection[] = []
  for (let i = 0; i < windDir.selectedOptions.length; i++) {
    const element = windDir.selectedOptions[i];

    selectedWindDirs.push(element.value as WindDirection)
  }

  const windSpeedMin = document.getElementById("windSpeedMin") as HTMLSelectElement | null;
  if(!windSpeedMin || !windSpeedMin.value) {
    window.alert('Missing Wind Direction')
    return;
  }
  const windSpeedMax = document.getElementById("windSpeedMax") as HTMLSelectElement | null;
   if(!windSpeedMax || !windSpeedMax.value) {
    window.alert('Missing Wind Direction')
    return;
  }


  const request: WeatherNotificationSubscription = {
    email: email.value,
    location: location.value,
    constraints: {
      windDir: selectedWindDirs
      windSpeed: { //not sure why it is squiggly
        min: parseInt(windSpeedMin.value),
        max: parseInt(windSpeedMax.value)
      }
    }, // todo fill in the constraints
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
