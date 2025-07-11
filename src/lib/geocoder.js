export default async function getLongLat(city, county, state){
const country = 'PH'
const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(city)}&county=${encodeURIComponent(county)}&state=${encodeURIComponent(state)}&countrycodes=${country}&format=json`;

try{
    const response = await fetch(url,{headers: {
        'Accept': 'application/json',
      }},);
    if (!response.ok){
        throw new Error("Error fetching longlat");
    }
    const data = await response.json();
    if (!data || data.length === 0) {
        console.error("No results found from Nominatim for this query");
        return null; 
      }
    return {
        lat: data[0].lat,
        lon: data[0].lon,
    }
} catch(error){
    console.error(error)
}
    
}