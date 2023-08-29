import type { InputContraints } from "./types"

interface TextInputProps {
    inputName: string,
    inputType: string,
    labelText: string,
    constraintValue: string,
    inputConstraintKey: keyof InputContraints,
    handleInputChange: (currentInput: keyof InputContraints, value: string) => void
}


export default function TextInput ( props: TextInputProps) { 

    const { inputName, inputType, labelText, constraintValue, handleInputChange, inputConstraintKey } = props;

    return (
        <div className="bg-white p-4 rounded-md shadow-md w-auto">
            <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor={inputName}>{labelText}</label>
            <input 
                className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600" 
                type={inputType} 
                id={inputName} 
                name={inputName} 
                value={constraintValue} 
                onChange={(e) => handleInputChange(inputConstraintKey, e.target.value)} 
            />
        </div>
    )
}