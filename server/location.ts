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
        const data = await res.json() as any

        if (!data?.features?.length) {       
            throw new Error('No data returned')
        }
  
        const [lon, lat] : number[] = data.features[0].center

        const roundedLon = Number(lon.toFixed(3));
        const roundedLat = Number(lat.toFixed(3));
  
        return [roundedLat, roundedLon]
    }
    catch (err) {
        throw new Error(`Failed to retrieve coordinates for location: ${location}. Error: ${err}`);
    }
  }