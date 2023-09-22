import { WindDirection } from "../../../../common/weather";

interface WindDirInputProps {
    handleWindDirInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function WindDirInput (props: WindDirInputProps) {

    const { handleWindDirInputChange } = props;
    const windDirections: WindDirection[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    return (
        <div className="bg-white p-4 rounded-md shadow-md w-auto">
            <div>
                <p className="block mb-2 text-sm font-medium text-gray-600">Wind Direction</p>

                <div className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600 grid grid-cols-4">
                    {windDirections.map((dir) => (
                        <div key={dir} className="mb-1 items-center flex">
                            <input type="checkbox" id={dir} name="windDirection" value={dir} onChange={handleWindDirInputChange} className="text-gray-600 focus:ring-blue-500 form-checkbox h-5 w-5 self-center" />
                            <label className="ml-2 text-md text-gray-600 self-center" htmlFor={dir}>{dir}</label>
                        </div>
                    ))}
                </div>
            </div>


            {/* <label className="block mb-2 text-sm font-medium text-gray-600" htmlFor="windDir">Wind Direction</label>
            <select className="w-full p-2 bg-gray-200 rounded-md focus:outline-none focus:border-blue-500 border-2 text-gray-600" name="windDirection" id="windDir" multiple onChange={handleWindDirInput}>

                {windDirections.map((dir) => (
                    <option key={dir} value={dir}>{dir}</option>
                ))}
                
            </select> */}
        </div>
    )
}