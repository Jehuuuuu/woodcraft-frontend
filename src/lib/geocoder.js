export default async function getLongLat(city, province, region){
    const baseUrl = "https://nominatim.openstreetmap.org/search";
    const country = "ph";
  
    let url = `${baseUrl}?city=${encodeURIComponent(city)}&county=${encodeURIComponent(province)}&state=${encodeURIComponent(region)}&countrycodes=${country}&format=json`;
  
    try{
        let response = await fetch(url, { headers: { "User-Agent": "hufanohandicraft@gmail.com" } });
        let data = await response.json();

        if (data.length === 0) {
            const query = `${city}, ${province}, ${region}, Philippines`;
            url = `${baseUrl}?q=${encodeURIComponent(query)}&countrycodes=ph&format=json&viewbox=116.87,5.58,126.60,20.46&bounded=1`;
            response = await fetch(url, { headers: { "User-Agent": "hufanohandicraft@gmail.com" } });
            data = await response.json();
        }

        if (!data || data.length === 0) {
            return null;
        }

        return {
            lat: data[0].lat,
            lon: data[0].lon,
        }
    } catch(error){
        console.error(error);
        return null;
    }
}