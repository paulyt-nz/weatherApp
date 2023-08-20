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
        <div className="">
            <p>{labelText}</p>
            <label className="" htmlFor={inputName.min}>from</label>
            <input 
                className="" 
                type="number" 
                id={inputName.min} 
                name={inputName.min} 
                min={value.min} 
                max={value.max}
                placeholder={placeholder.min} 
                value={constraintValue.min} 
                onChange={(e) => handleInputChange(constraintStateKey.min, e.target.value)} 
            />
            
            <label className="" htmlFor={inputName.max}>to</label>
            <input 
                className="" type="number" 
                id={inputName.max} 
                name={inputName.max} 
                min={value.min} 
                max={value.max} 
                placeholder={placeholder.max} 
                value={constraintValue.max} 
                onChange={(e) => handleInputChange(constraintStateKey.max, e.target.value)} 
            />
        </div>
    )
}