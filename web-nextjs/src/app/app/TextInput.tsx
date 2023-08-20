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
        <div className="">
            <label className="" htmlFor={inputName}>{labelText}</label>
            <input 
                className="" 
                type={inputType} 
                id={inputName} 
                name={inputName} 
                value={constraintValue} 
                onChange={(e) => handleInputChange(inputConstraintKey, e.target.value)} 
            />
        </div>
    )
}