export default async function getSuggestions(query, lat, long){
const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(long)}&limit=10`
try{
    const response =  await fetch(url);
    if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Error fetching suggestions: ${errorText}`);
      }
    const data = await response.json()
    return data.features.map((feature) => ({
        name: feature.properties.name,
        postcode: feature.properties.postcode,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
    }))
}   catch (error) {
    console.error("Error fetching suggestions", error);
    return [];
}
}