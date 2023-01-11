import fetch from 'node-fetch';
const MapBoxApiKey = process.env.MAPBOX;

if (!MapBoxApiKey) {
    throw new Error("Missing MAPBOX API key from .env vars");
}

export async function convertLocationToCoords (location: string): Promise<number[] | null> {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json?access_token=${MapBoxApiKey}`
  
    console.debug(url)
  
    try {
        const res = await fetch(url)
        console.debug("res:  ", res)
        const data = await res.json() as any
        console.debug("data:  ",data)
  
        const [lon, lat] : number[] = data.features[0].center
        console.debug('lat: ', lat, 'long: ', lon)
  
        return Promise.resolve([lat, lon])
    }
    catch (err) {
        return Promise.reject(new Error (`Failed to retrieve coordinates for location: ${location}. Error: ${err}`));
    }
  }