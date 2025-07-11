import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix default icon path issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function Map({ lat, lon }) {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        center={[lat ?? 14.5995, lon ?? 120.9842]}
        zoom={13}
        // scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat ?? 14.5995, lon ?? 120.9842]} draggable={true}>
          <Popup>
            <b>Your address is here.</b> <br /> Place the pin to your exact
            location.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
