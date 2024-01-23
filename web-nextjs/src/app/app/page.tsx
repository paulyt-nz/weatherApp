"use client";

import { useState, CSSProperties, useEffect } from "react"
import Footer from "../Footer"
import Navbar from "../Navbar"
import ConstraitCheckbox from "./ConstraintCheckbox"
import ConstraintInputForm from "./ConstraintInputForm";
import type { WeatherNotificationSubscription, WindDirection } from '../../../../types/weatherTypes'
import type { ShownContraints, InputContraints } from "./types";
import background from "./backgrounds/background5.jpg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkUserData, getCoordsFromLocation, sendSubscriptionRequest } from "./appPageFunctions";
import { sendWakeupCall } from "../homePageFunctions";


export default function MainApp() {

  function showSuccessMessage() { 
    toast.success(<div>You are now subscribed!<br/>We will email you when the weather is right!<br/>☀️🌈😎</div>, {
      className: 'success-message'
    });
  }
  function showErrorMessage(errorMessage : any) { 
    toast.error(<div>{errorMessage}</div>, {
      className: 'error-message'
    });
  }
  

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


  useEffect(() => {
    sendWakeupCall();
  }, []);


  function handleCheckboxChange(clickedCheckbox: keyof ShownContraints) {
    setShownConstraints(prevState => {
      const checkedCount = Object.values(prevState).filter(value => value === true).length;

      if (checkedCount === 1 && prevState[clickedCheckbox]) {
        showErrorMessage("At least one constraint must remain selected.")
        return prevState;
      }
      
      return {
      ...prevState,
      [clickedCheckbox]: !prevState[clickedCheckbox]
      };
    });
  };


  function handleInputChange(currentInput: keyof InputContraints, value: string) {
    setInputConstraints(prevState => ({
      ...prevState,
      [currentInput]: value
    }));
  }


  function handleWindDirInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value as WindDirection;

    setInputConstraints(prevConstraints => {
        let updatedWindDirs;

        if (e.target.checked) {
            updatedWindDirs = [...prevConstraints.windDirInput, value];
        } else {
            updatedWindDirs = prevConstraints.windDirInput.filter(dir => dir !== value);
        }

        return {
            ...prevConstraints,
            windDirInput: updatedWindDirs
        };
    });
  }


  function checkConstraints(request : WeatherNotificationSubscription) {
    if (shownConstraints.showWindDir) {
      if (!request.constraints.windDir || !request.constraints.windDir.length) {
        throw new Error("No wind direction selected! Either add a wind direction or deselect that option in the checkbox.")
      }
    }

    if (shownConstraints.showWindSpeed) {
      if (!request.constraints.windSpeed || !request.constraints.windSpeed.min) {
        throw new Error("Missing minimum wind speed! Either add a minimum windspeed or deselect that option in the checkbox.")
      }
      if (!request.constraints.windSpeed.max) {
        throw new Error("Missing maximum wind speed! Either add a maiximum windspeed or deselect that option in the checkbox.")
      }
      if (Number(request.constraints.windSpeed.min) > Number(request.constraints.windSpeed.max)) {
        throw new Error("Minimum wind speed must be less than maximum wind speed!")
      }
    }

    if (shownConstraints.showTemp) {
      if (!request.constraints.temperature || !request.constraints.temperature.min) {
        throw new Error("Missing minimum temperature! Either add a minimum temperature or deselect that option in the checkbox.")
      }
      if (!request.constraints.temperature.max) {
        throw new Error("Missing maximum temperature! Either add a maximum temperature or deselect that option in the checkbox.")
      }
      if (Number(request.constraints.temperature.min) > Number(request.constraints.temperature.max)) {
        throw new Error("Minimum temperature must be less than maximum temperature!")
      }
    }

    if (shownConstraints.showHumidity) {
      if (!inputConstraints.humidityMinInput) {
        throw new Error("Missing minimum humidity! Either add a minimum humidity or deselect that option in the checkbox.")
      }
      if (!inputConstraints.humidityMaxInput) {
        throw new Error("Missing maximum humidity! Either add a maximum humidity or deselect that option in the checkbox.")
      }      
      if (Number(inputConstraints.humidityMinInput) > Number(inputConstraints.humidityMaxInput)) {
        throw new Error("Minimum humidity must be less than maximum humidity!")
      }
    }

    return true;
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
    catch (err: any) {
      console.debug(err as Error)
      showErrorMessage((err as Error).message);
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
                      handleWindDirInputChange={handleWindDirInputChange} />
                </div>
              
            </div>
        </div>
  
        <Footer style={footerStyles}/>
    </div>
  )
}