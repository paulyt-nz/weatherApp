"use client";

import { useState } from "react"
import Footer from "../Footer"
import Navbar from "../Navbar"
import ConstraitCheckbox from "./ConstraintCheckbox"
import ConstraintInputForm from "./ConstraintInputForm";
import axios from "axios"

import type { WeatherNotificationSubscription, WindDirection } from '../../../../common/weather'
import type { ShownContraints, InputContraints } from "./types";


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


export default function MainApp() {

  const initialShownConstraints : ShownContraints = {
    showWindDir: true,
    showWindSpeed: true,
    showTemp: true,
    showHumidity: true
  }

  const inititialInputConstraints: InputContraints = {
    emailInput: "",
    locationInput: "",
    windDirInput: [],
    windSpeedMinInput: "",
    windSpeedMaxInput: "",
    tempMinInput: "",
    tempMaxInput: "",
    humidityMinInput: "",
    humidityMaxInput: ""
  }

  const [ shownConstraints, setShownConstraints ] = useState<ShownContraints>(initialShownConstraints);
  const [ inputConstraints, setInputConstraints ] = useState<InputContraints>(inititialInputConstraints);

  function handleCheckboxChange(clickedCheckbox: keyof ShownContraints) {
    setShownConstraints(prevState => ({
      ...prevState,
      [clickedCheckbox]: !prevState[clickedCheckbox]
    }));
  };

  function handleInputChange(currentInput: keyof InputContraints, value: string) {
    setInputConstraints(prevState => ({
      ...prevState,
      [currentInput]: value
    }));
  }

  function handleWindDirInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedOptions = Array.from(e.target.selectedOptions).map(o => o.value);
    setInputConstraints(prevState => ({
      ...prevState,
      windDirInput: selectedOptions as WindDirection[]
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let coords : number[];
    try {
      coords = await getCoordsFromLocation(inputConstraints.locationInput)
   
      const request : WeatherNotificationSubscription  = {
        email: inputConstraints.emailInput,
        location: inputConstraints.locationInput,
        coords: coords,
        notified_at: null,
        _id: undefined,
        constraints: {
          windDir: inputConstraints.windDirInput,
          windSpeed: { 
            min: Number(inputConstraints.windSpeedMinInput), 
            max: Number(inputConstraints.windSpeedMaxInput) 
          },
          temperature: { 
            min: Number(inputConstraints.tempMinInput), 
            max: Number(inputConstraints.tempMaxInput) 
          },
          humidity: { 
            min: Number(inputConstraints.humidityMinInput), 
            max: Number(inputConstraints.humidityMaxInput) 
          }
        }
      }

      checkUserData(request);
      checkConstraints(request);
      await sendRequest(request);
      setInputConstraints(inititialInputConstraints);
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

            <ConstraitCheckbox 
                handleCheckboxChange={handleCheckboxChange} 
                shownConstraints={shownConstraints} />
            
            <ConstraintInputForm 
                inputConstraints={inputConstraints}
                shownConstraints={shownConstraints}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                handleWindDirInput={handleWindDirInput} />
          
        </div>
  
        <Footer />
    </div>
  )
}