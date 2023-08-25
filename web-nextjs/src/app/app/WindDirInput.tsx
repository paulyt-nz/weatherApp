import { WindDirection } from "../../../../common/weather";

interface WindDirInputProps {
    handleWindDirInput: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function WindDirInput (props: WindDirInputProps) {

    const { handleWindDirInput } = props;
    const windDirections: WindDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    return (
        <div className="">
            <label className="" htmlFor="windDir">Wind Direction</label>
            <select className="" name="windDirection" id="windDir" multiple onChange={handleWindDirInput}>

                {windDirections.map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                ))}
                
            </select>
        </div>
    )
}