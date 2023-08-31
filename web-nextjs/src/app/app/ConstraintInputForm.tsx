import type { ShownContraints, InputContraints } from "./types";
import TextInput from "./TextInput"
import MinMaxInput from "./MinMaxInput"
import WindDirInput from "./WindDirInput"

interface ConstraintInputFormProps {
    inputConstraints: InputContraints,
    shownConstraints: ShownContraints
    handleInputChange: (currentInput: keyof InputContraints, value: string) => void,
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>,
    handleWindDirInput: (e: React.ChangeEvent<HTMLSelectElement>) => void
}


export default function ConstraintInputForm (props: ConstraintInputFormProps) {

    const { inputConstraints, shownConstraints, handleInputChange, handleSubmit, handleWindDirInput } = props;

    return (
        <form className="bg-gray-100 p-8 rounded-xl shadow-lg max-w-xl mx-auto space-y-6" onSubmit={handleSubmit}>

            <legend id="constraint-legend" className="text-lg font-semibold mb-3 text-gray-600">Enter your constraints</legend>

            <TextInput 
              inputName="email" 
              inputType="email" 
              labelText="Email Address" 
              constraintValue={inputConstraints.emailInput} 
              handleInputChange={handleInputChange} 
              inputConstraintKey="emailInput" 
            />

            <TextInput 
              inputName="location" 
              inputType="text" 
              labelText="Location" 
              constraintValue={inputConstraints.locationInput} 
              handleInputChange={handleInputChange} 
              inputConstraintKey="locationInput" 
            />

            {shownConstraints.showWindDir && (
              <WindDirInput handleWindDirInput={handleWindDirInput}/>
            )}

            {shownConstraints.showWindSpeed && (  
              <MinMaxInput 
                inputName={{min: "windSpeedMin", max: "windSpeedMax"}} 
                labelText="Wind Speed" 
                value={{min: '0', max: '100'}} 
                placeholder={{min: "0kph", max: "50kph"}} 
                constraintValue={{min: inputConstraints.windSpeedMinInput, max: inputConstraints.windSpeedMaxInput}} 
                handleInputChange={handleInputChange} 
                constraintStateKey={{min: 'windSpeedMinInput', max: 'windSpeedMaxInput'}} 
              />
            )}

            {shownConstraints.showTemp && (  
              <MinMaxInput 
                inputName={{min: "tempMin", max: "tempMax"}} 
                labelText="Temperature" 
                value={{min: '-10', max: '50'}} 
                placeholder={{min: "-10°C", max: "45°C"}} 
                constraintValue={{min: inputConstraints.tempMinInput, max: inputConstraints.tempMaxInput}} 
                handleInputChange={handleInputChange} 
                constraintStateKey={{min: 'tempMinInput', max: 'tempMaxInput'}} 
              />
            )}

            {shownConstraints.showHumidity && (  
              <MinMaxInput 
                inputName={{min: "humidityMin", max: "humidityMax"}} 
                labelText="Humidity" value={{min: '0', max: '100'}} 
                placeholder={{min: "10%", max: "100%"}} 
                constraintValue={{min: inputConstraints.humidityMinInput, max: inputConstraints.humidityMaxInput}} 
                handleInputChange={handleInputChange} 
                constraintStateKey={{min: 'humidityMinInput', max: 'humidityMaxInput'}} />
            )}

            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:border-blue-800 focus:ring focus:ring-blue-200" type="submit" id="submit">Submit</button>

        </form>
    )
}