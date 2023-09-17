"use client";

import { useState, CSSProperties } from "react"
import Head from 'next/head'
import Footer from "../Footer"
import Navbar from "../Navbar"
import ConstraitCheckbox from "./ConstraintCheckbox"
import ConstraintInputForm from "./ConstraintInputForm";
import type { WeatherNotificationSubscription, WindDirection } from '../../../../common/weather'
import type { ShownContraints, InputContraints } from "./types";
import background from "./backgrounds/background5.jpg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next'
import { checkConstraints, checkUserData, getCoordsFromLocation, sendSubscriptionRequest } from "./appPageFunctions";


export const metadata: Metadata = {
  title: '########S',
}

export function showSuccessMessage() { 
  toast.success(<div>You are now subscribed!<br/>We will email you when the weather is right!<br/>☀️🌈😎</div>, {
    className: 'success-message'
  });
}


export function showErrorMessage() { 
  toast.error(<div>Sorry, something went wrong!<br/>Please try again later</div>, {
    className: 'error-message'
  });
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
      showSuccessMessage();
      setInputConstraints(inititialInputConstraints);
    } 
    catch (err) {
      console.debug(err)
      // make a nice error handling message here
    }
  }

  const navbarStyles: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(1px)',
    color: 'white'
  }

  const footerStyles: CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    backdropFilter: 'blur(1px)',
    color: 'white'
  }
   
  return (
    <div className="bg-gray-200 min-h-screen flex flex-col min-h-screen bg-cover bg-center" style={{backgroundImage: `url(${background.src})`}}>
        <Navbar style={navbarStyles}/>

        <ToastContainer />

        <div className="relative w-full min-h-full overflow-y-auto flex-grow flex flex-col lg:justify-center items-center" >
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
  
        <Footer style={footerStyles}/>
    </div>
  )
}