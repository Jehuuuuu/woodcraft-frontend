export default async function getSuggestions(query){
const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
try{
    const response =  await fetch(url);
    if (!response.ok) {
        throw new Error("Error fetching suggestions");
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