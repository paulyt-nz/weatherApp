import fetch from 'node-fetch';
import { log } from '../common/logger';
const MapBoxApiKey = process.env.MAPBOX;

if (!MapBoxApiKey) {
    log.error("Missing MAPBOX API key from .env vars");
    throw new Error("Missing MAPBOX API key from .env vars");
}

export async function convertLocationToCoords (location: string): Promise<number[] | null> {
    log.debug(`Retrieving coordinates for location: ${location}`)
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MapBoxApiKey}`
  
    log.debug("fetching from url: ", url)
  
    try {
        const res = await fetch(url)
        const data = await res.json() as any

        if (!data?.features?.length) {   
            log.error(`No data returned for location: ${location}`)    
            throw new Error('No data returned')
        }
  
        const [lon, lat] : number[] = data.features[0].center

        const roundedLon = Number(lon.toFixed(3));
        const roundedLat = Number(lat.toFixed(3));
        
        log.debug(`Coordinates for location: ${location} are: ${roundedLat}, ${roundedLon}`)
        return [roundedLat, roundedLon]
    }
    catch (err) {
        log.error(`Failed to retrieve coordinates for location: ${location}. Error: ${err}`)
        throw new Error(`Failed to retrieve coordinates for location: ${location}. Error: ${err}`);
    }
  }