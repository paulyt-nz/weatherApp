"use client";

import { useState } from "react"
import Footer from "../Footer"
import Navbar from "../Navbar"
import axios from "axios"

import type { WeatherNotificationSubscription, WindDirection } from '../../../../common/weather'


export async function sendRequest(request : WeatherNotificationSubscription) {
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

    window.alert("Congrats you are now subscribed!");
  } catch (error) {
    console.error(error);
    window.alert((error as any)?.message);
  }
}

export async function getCoordsFromLocation(location: string) : Promise<number[]> {
  console.log('getting coords from location')
  try {   
    const res = await axios.get(`http://localhost:8081/api/coords?location=${encodeURIComponent(location)}`);
    const coords = res.data;
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
}



function checkConstraints(request : WeatherNotificationSubscription) {
  // validate contraint data here
  //    - make sure that min < max for all of them
  //    - make sure that at least one type of constraint is present
}

interface ShownContraints {
  showWindDir: boolean,
  showWindSpeed: boolean,
  showTemp: boolean,
  showHumidity: boolean
}

interface InputContraints {
  emailInput: string,
  locationInput: string,
  windDirInput: WindDirection[],
  windSpeedMinInput: string,
  windSpeedMaxInput: string,
  tempMinInput: string,
  tempMaxInput: string,
  humidityMinInput: string,
  humidityMaxInput: string
}


export default function MainApp() {

  const initialShownConstraints : ShownContraints = {
    showWindDir: true,
    showWindSpeed: true,
    showTemp: true,
    showHumidity: true
  }

  const [ shownConstraints, setShownConstraints ] = useState<ShownContraints>(initialShownConstraints);

  function handleCheckboxChange(checkbox: keyof ShownContraints) {
    setShownConstraints(prevState => ({
      ...prevState,
      [checkbox]: !prevState[checkbox]
    }));
  };

  const [ emailInput, setEmailInput ] = useState("");
  const [ locationInput, setLocationInput ] = useState("");
  const [ windDirInput, setWindDirInput ] = useState<WindDirection[]>([]);
  const [ windSpeedMinInput, setWindSpeedMinInput ] = useState("");
  const [ windSpeedMaxInput, setWindSpeedMaxInput ] = useState("");
  const [ tempMinInput, setTempMinInput ] = useState("");
  const [ tempMaxInput, setTempMaxInput ] = useState("");
  const [ humidityMinInput, setHumidityMinInput ] = useState("");
  const [ humidityMaxInput, setHumidityMaxInput ] = useState("");


  function handleWindDirInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = Array.from(e.target.selectedOptions).map(o => o.value);
    setWindDirInput(selectedOptions as WindDirection[]);
  }

  function clearInputs() {
    setEmailInput("");
    setLocationInput("");
    setWindDirInput([]);
    setWindSpeedMinInput("");
    setWindSpeedMaxInput("");
    setTempMinInput("");
    setTempMaxInput("");
    setHumidityMinInput("");
    setHumidityMaxInput("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let coords : number[];
    try {
      coords = await getCoordsFromLocation(locationInput)
   
      const request : WeatherNotificationSubscription  = {
        email: emailInput,
        location: locationInput,
        coords: coords,
        notified_at: null,
        _id: undefined,
        constraints: {
          windDir: windDirInput,
          windSpeed: { 
            min: Number(windSpeedMinInput), 
            max: Number(windSpeedMaxInput) 
          },
          temperature: { 
            min: Number(tempMinInput), 
            max: Number(tempMaxInput) 
          },
          humidity: { 
            min: Number(humidityMinInput), 
            max: Number(humidityMaxInput) 
          }
        }
      }

      console.log(request)

      checkUserData(request);
      checkConstraints(request);
      await sendRequest(request);
      clearInputs();
    } 
    catch (err) {
      console.debug(err)
      // make a nice error handling message here
    }
  }
  

  return (
    <div className="">
        <Navbar />

        <h1>THIS WILL BE THE MAIN APP</h1>


        <div className="">

          <div className="">
            <fieldset>
              <legend>Choose your parameters</legend>

              <div>
                <input type="checkbox" id="windDirectionCheckbox" name="windDirectionCheckbox" checked={shownConstraints.showWindDir} onChange={() => handleCheckboxChange('showWindDir')}  />
                <label htmlFor="windDirectionCheckbox">Wind Direction</label>
              </div>

              <div>
                <input type="checkbox" id="windSpeedCheckBox" name="windSpeedCheckBox" checked={shownConstraints.showWindSpeed} onChange={() => handleCheckboxChange('showWindSpeed')} />
                <label htmlFor="windSpeedCheckBox">Wind Speed</label>
              </div>

              <div>
                <input type="checkbox" id="tempCheckbox" name="tempCheckbox" checked={shownConstraints.showTemp} onChange={() => handleCheckboxChange('showTemp')}  />
                <label htmlFor="tempCheckbox">Temperature</label>
              </div>

              <div>
                <input type="checkbox" id="humidityCheckbox" name="humidityCheckbox" checked={shownConstraints.showHumidity} onChange={() => handleCheckboxChange('showHumidity')} />
                <label htmlFor="humidityCheckbox">Humidity</label>
              </div>

            </fieldset>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="">
              <label className="" htmlFor="email">Email Address</label>
              <input className="" type="email" id="email" name="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
            </div>

            <div className="">
              <label className="" htmlFor="location">Location</label>
              <input className="" type="text" id="location" name="location" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} />
            </div>

            {shownConstraints.showWindDir && (
            <div className="">
              <label className="" htmlFor="windDir">Wind Direction</label>
              <select className="" name="windDirection" id="windDir" multiple value={windDirInput} onChange={handleWindDirInput}>
                <option value="N">North</option>
                <option value="NE">NE</option>
                <option value="E">E</option>
                <option value="SE">SE</option>
                <option value="S">S</option>
                <option value="SW">SW</option>
                <option value="W">W</option>
                <option value="NW">NW</option>
              </select>
            </div>)}

            {shownConstraints.showWindSpeed && (  
            <div className="">
              <p>Wind Speed</p>
              <label className="" htmlFor="windSpeedMin">from</label>
              <input className="" type="number" id="windSpeedMin" name="windSpeedMin" min="0" max="100" placeholder="0kph" value={windSpeedMinInput} onChange={(e) => setWindSpeedMinInput(e.target.value)}/>
             
              <label className="" htmlFor="windSpeedMax">to</label>
              <input className="" type="number" id="windSpeedMax" name="windSpeedMax" min="0" max="100" placeholder="50kph" value={windSpeedMaxInput} onChange={(e) => setWindSpeedMaxInput(e.target.value)}/>
            </div>)}

            {shownConstraints.showTemp && (
            <div className="">
              <p>Temperature</p>
              <label className="" htmlFor="tempMin">from</label>
              <input className="" type="number" id="tempMin" name="tempMin" min="-10" max="45" placeholder="-10°C" value={tempMinInput} onChange={(e) => setTempMinInput(e.target.value)}/>
             
              <label className="" htmlFor="tempMax">to</label>
              <input className="" type="number" id="tempMax" name="tempMax" min="-10" max="45" placeholder="45°C" value={tempMaxInput} onChange={(e) => setTempMaxInput(e.target.value)}/>
            </div>)}

            {shownConstraints.showHumidity && (
            <div className="">
              <p>Humidity</p>
              <label className="" htmlFor="humidityMin">from</label>
              <input className="" type="number" id="humidityMin" name="humidityMin" min="10" max="100" placeholder="10%" value={humidityMinInput} onChange={(e) => setHumidityMinInput(e.target.value)}/>
              
              <label className="" htmlFor="humidityMax">to</label>
              <input className="" type="number" id="humidityMax" name="humidityMax" min="10" max="100" placeholder="100%" value={humidityMaxInput} onChange={(e) => setHumidityMaxInput(e.target.value)}/>
            </div>)}

            <div className="">
              <input className="btn btn-success" type="submit" value="Submit" id="submit" />
            </div>

          </form>
        </div>
  
        <Footer />
    </div>
  )
}