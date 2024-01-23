const apiAddress = "https://weather-app-server-2k0c.onrender.com" || 
  "http://localhost:8081"

export async function sendWakeupCall() {
    console.log("sending wakeup call")
    const res = await fetch(`${apiAddress}/api/wakeup`);
    const result = await res.json();
    console.log(result);
  }