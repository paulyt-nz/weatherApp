// testing for the convertLocationToCoords function
require("dotenv").config();
const MapBoxApiKey = process.env.MAPBOX;
import { convertLocationToCoords } from './weatherFunctions';

convertLocationToCoords('Plimmerton');
