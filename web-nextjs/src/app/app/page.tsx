"use client";

import { useState } from "react"
import Footer from "../Footer"
import Navbar from "../Navbar"
import ConstraitCheckbox from "./ConstraintCheckbox"
import ConstraintInputForm from "./ConstraintInputForm";
import type { WeatherNotificationSubscription, WindDirection } from '../../../../common/weather'
import type { ShownContraints, InputContraints } from "./types";
import background from "./backgrounds/background5.jpg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
}

function checkConstraints(request : WeatherNotificationSubscription) {
  // validate contraint data here
  //    - make sure that min < max for all of them
  //    - make sure that at least one type of constraint is present
}

function showSuccessNotification() { 
  toast.success(<div>You are now subscribed!<br/>We will email you when the weather is right!<br/>☀️🌈😎</div>);
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
      await sendSubscriptionRequest(request);
      showSuccessNotification();
      setInputConstraints(inititialInputConstraints);
    } 
    catch (err) {
      console.debug(err)
      // make a nice error handling message here
    }
  }
  

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col min-h-screen">
        <Navbar />

        <ToastContainer />

        <div className="relative w-full min-h-full bg-cover bg-center overflow-y-auto flex-grow flex flex-col lg:justify-center items-center" onClick={showSuccessNotification} style={{backgroundImage: `url(${background.src})`}}>
            <div className="container relative">

                <div className="mx-auto xl:fixed xl:left-0 xl:ml-10 xl:bottom-1/2">
                  <ConstraitCheckbox 
                      handleCheckboxChange={handleCheckboxChange} 
                      shownConstraints={shownConstraints} />
                </div>
                
                <div className="justify-self-center m-8">
                  <ConstraintInputForm 
                      inputConstraints={inputConstraints}
                      shownConstraints={shownConstraints}
                      handleInputChange={handleInputChange}
                      handleSubmit={handleSubmit}
                      handleWindDirInput={handleWindDirInput} />
                </div>
              
            </div>
        </div>
  
        <Footer />
    </div>
  )
}