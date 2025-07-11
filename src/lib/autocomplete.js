export default async function getSuggestions(query, lat, long){
let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en&limit=10`;

if (lat && long) {
      url += `&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(long)}`;
    }
try{
    const response =  await fetch(url);
    if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Error fetching suggestions: ${errorText}`);
      }
    const data = await response.json()
    return data.features.map((feature) => ({
        id: feature.properties.osm_id,
        name: feature.properties.name,
        postcode: feature.properties.postcode,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        type: feature.properties.osm_value,
        city: feature.properties.city ?? null,
        country: feature.properties.country,
    }))
}   catch (error) {
    console.error("Error fetching suggestions", error);
    return [];
}
}