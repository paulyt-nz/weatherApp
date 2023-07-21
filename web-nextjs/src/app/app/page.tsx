"use client";

import { useState } from "react"
import Footer from "../Footer"
import Navbar from "../Navbar"

export default function MainApp() {


  const [ showWindDirection, setShowWindDirection ] = useState(true);
  const [ showWindSpeed, setShowWindSpeed ] = useState(true);
  const [ showTemp, setShowTemp ] = useState(true);
  const [ showHumidity, setShowHumidity ] = useState(false);

  
  return (
    <main className="">
        <Navbar />

        <h1>THIS WILL BE THE MAIN APP</h1>


        <div className="">

          <div className="">
            <fieldset>
              <legend>Choose your parameters</legend>

              <div>
                <input type="checkbox" id="windDirectionCheckbox" name="windDirectionCheckbox" checked={showWindDirection} onChange={() => setShowWindDirection(!showWindDirection)} />
                <label htmlFor="windDirectionCheckbox">Wind Direction</label>
              </div>

              <div>
                <input type="checkbox" id="windSpeedCheckBox" name="windSpeedCheckBox" checked={showWindSpeed} onChange={() => setShowWindSpeed(!showWindSpeed)} />
                <label htmlFor="windSpeedCheckBox">Wind Speed</label>
              </div>

              <div>
                <input type="checkbox" id="tempCheckbox" name="tempCheckbox" checked={showTemp} onChange={() => setShowTemp(!showTemp)} />
                <label htmlFor="tempCheckbox">Temperature</label>
              </div>

              <div>
                <input type="checkbox" id="humidityCheckbox" name="humidityCheckbox" checked={showHumidity} onChange={() => setShowHumidity(!showHumidity)}/>
                <label htmlFor="humidityCheckbox">Humidity</label>
              </div>

            </fieldset>
          </div>

          <form>
            <div className="">
              <label className="" htmlFor="email">Email Address</label>F
              <input className="" type="email" id="email" name="email" />
            </div>

            <div className="">
              <label className="" htmlFor="location">Location</label>
              <input className="" type="text" id="location" name="location" />
            </div>

            {showWindDirection && (
            <div className="">
              <label className="" htmlFor="windDirection">Wind Direction</label>
              <select className="" name="windDirection" id="windDirection" multiple>
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

            {showWindSpeed && (  
            <div className="">
              <p>Wind Speed</p>
              <label className="" htmlFor="windSpeedMin">from</label>
              <input className="" type="number" id="windSpeedMin" name="windSpeedMin" min="0" max="100" placeholder="0kph" />
             
              <label className="" htmlFor="windSpeedMax">to</label>
              <input className="" type="number" id="windSpeedMax" name="windSpeedMax" min="0" max="100" placeholder="50kph" />
            </div>)}

            {showTemp && (
            <div className="">
              <p>Temperature</p>
              <label className="" htmlFor="tempMin">from</label>
              <input className="" type="number" id="tempMin" name="tempMin" min="-10" max="45" placeholder="-10°C" />
             
              <label className="" htmlFor="tempMax">to</label>
              <input className="" type="number" id="tempMax" name="tempMax" min="-10" max="45" placeholder="45°C" />
            </div>)}

            {showHumidity && (
            <div className="mb-3">
              <p>Humidity</p>
              <label className="" htmlFor="humidityMin">from</label>
              <input className="" type="number" id="humidityMin" name="humidityMin" min="10" max="100" placeholder="10%" />
              
              <label className="" htmlFor="humidityMax">to</label>
              <input className="" type="number" id="humidityMax" name="humidityMax" min="10" max="100" placeholder="100%" />
            </div>)}

            <div className="">
              <input className="btn btn-success" type="submit" value="Submit" id="submit" />
            </div>

          </form>
        </div>
  
        <Footer />
    </main>
  )
} // export default function Home()