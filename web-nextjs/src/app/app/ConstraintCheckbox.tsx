import React from "react";
import type { ShownContraints } from "./types";


interface ConstraintCheckboxProps {
    shownConstraints: ShownContraints,
    handleCheckboxChange: (clickedCheckbox: keyof ShownContraints) => void;
}


export default function ConstraintCheckbox ({ shownConstraints, handleCheckboxChange }: ConstraintCheckboxProps ) {

    return (
        <div className="p-6 bg-gray-100 rounded-xl shadow-md mt-4 mb-6 mx-auto w-72">
            <fieldset>
                <legend className="text-lg font-semibold mb-3 text-gray-600">Choose your parameters</legend>

                <div className="flex items-center space-x-2 mb-2">
                    <input className="form-checkbox h-5 w-5 rounded text-blue-600" type="checkbox" id="windDirectionCheckbox" name="windDirectionCheckbox" checked={shownConstraints.showWindDir} onChange={() => handleCheckboxChange('showWindDir')}  />
                    <label className="text-sm text-gray-600" htmlFor="windDirectionCheckbox">Wind Direction</label>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <input className="form-checkbox h-5 w-5 rounded text-blue-600" type="checkbox" id="windSpeedCheckBox" name="windSpeedCheckBox" checked={shownConstraints.showWindSpeed} onChange={() => handleCheckboxChange('showWindSpeed')} />
                    <label className="text-sm text-gray-600" htmlFor="windSpeedCheckBox">Wind Speed</label>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <input className="form-checkbox h-5 w-5 rounded text-blue-600" type="checkbox" id="tempCheckbox" name="tempCheckbox" checked={shownConstraints.showTemp} onChange={() => handleCheckboxChange('showTemp')}  />
                    <label className="text-sm text-gray-600" htmlFor="tempCheckbox">Temperature</label>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <input className="form-checkbox h-5 w-5 rounded text-blue-600" type="checkbox" id="humidityCheckbox" name="humidityCheckbox" checked={shownConstraints.showHumidity} onChange={() => handleCheckboxChange('showHumidity')} />
                    <label className="text-sm text-gray-600" htmlFor="humidityCheckbox">Humidity</label>
                </div>

            </fieldset>
        </div>
    )
}