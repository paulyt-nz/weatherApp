import type { InputContraints } from "./types";

interface MinMaxInputProps {
    inputName: {min: string, max: string},
    labelText: string,
    value: { min: string, max: string },
    placeholder: { min: string, max: string },
    constraintValue: { min: string, max: string },
    handleInputChange: (currentInput: keyof InputContraints, value: string) => void,
    constraintStateKey: { min: keyof InputContraints, max: keyof InputContraints }
}

export default function MinMaxInput ( props: MinMaxInputProps ) {

    const { inputName, labelText, value, placeholder, constraintValue, handleInputChange, constraintStateKey } = props;

    return (        
        <div className="bg-white p-4 rounded-md shadow-md w-auto">
            <p className="block mb-2 text-sm font-medium text-gray-600">{labelText}</p>
            <div className="flex space-x-4">

                <div className="flex flex-col w-1/2">
                    <label className="block mb-1 text-sm text-gray-600" htmlFor={inputName.min}>from</label>
                    <input 
                        className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600" 
                        type="number" 
                        id={inputName.min} 
                        name={inputName.min} 
                        min={value.min} 
                        max={value.max}
                        placeholder={placeholder.min} 
                        value={constraintValue.min} 
                        onChange={(e) => handleInputChange(constraintStateKey.min, e.target.value)} 
                    />
                </div>
            
                <div className="flex flex-col w-1/2">
                    <label className="block mb-1 text-sm text-gray-600" htmlFor={inputName.max}>to</label>
                    <input 
                        className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600" 
                        type="number" 
                        id={inputName.max} 
                        name={inputName.max} 
                        min={value.min} 
                        max={value.max} 
                        placeholder={placeholder.max} 
                        value={constraintValue.max} 
                        onChange={(e) => handleInputChange(constraintStateKey.max, e.target.value)} 
                    />
                </div>

            </div>
        </div>
    )
}