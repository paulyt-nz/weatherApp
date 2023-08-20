import React from "react";
import type { ShownContraints } from "./types";


interface ConstraintCheckboxProps {
    shownConstraints: ShownContraints,
    handleCheckboxChange: (clickedCheckbox: keyof ShownContraints) => void;
}


export default function ConstraintCheckbox ({ shownConstraints, handleCheckboxChange }: ConstraintCheckboxProps ) {

    return (
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
    )
}