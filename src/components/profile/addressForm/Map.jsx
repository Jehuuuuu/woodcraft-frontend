import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import DraggableMarker from "./LocationMarker";
import LocateButton from "./LocateButton";

// Fix default icon path issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Map({ lat, lon, setLatitude, setLongitude }) {
  const position = [lat ?? 14.5995, lon ?? 120.9842];
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={13}
        // scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocateButton setLatitude={setLatitude} setLongitude={setLongitude} />
        <DraggableMarker
          position={position}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
      </MapContainer>
    </div>
  );
}
