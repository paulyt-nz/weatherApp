import { WindDirection } from "../../../../common/weather";

interface WindDirInputProps {
    handleWindDirInput: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function WindDirInput (props: WindDirInputProps) {

    const { handleWindDirInput } = props;
    const windDirections: WindDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    return (
        <div className="bg-white p-4 rounded-md shadow-md w-auto">
            <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="windDir">Wind Direction</label>
            <select className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600" name="windDirection" id="windDir" multiple onChange={handleWindDirInput}>

                {windDirections.map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                ))}
                
            </select>
        </div>
    )
}