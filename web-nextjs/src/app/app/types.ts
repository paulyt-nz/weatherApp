import type { WindDirection } from '../../../../types/weatherTypes'

export interface ShownContraints {
    showWindDir: boolean,
    showWindSpeed: boolean,
    showTemp: boolean,
    showHumidity: boolean
}
  
export interface InputContraints {
    emailInput: string,
    locationInput: string,
    windDirInput: WindDirection[],
    windSpeedMinInput: string,
    windSpeedMaxInput: string,
    tempMinInput: string,
    tempMaxInput: string,
    humidityMinInput: string,
    humidityMaxInput: string
}
