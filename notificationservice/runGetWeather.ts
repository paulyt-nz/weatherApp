// this is just to run getWeather to check the response is working
require("dotenv").config();
const OpenWeatherApiKey = process.env.OPEN_WEATHER;
import { getWeather } from './weatherFunctions'

getWeather('Matamata')