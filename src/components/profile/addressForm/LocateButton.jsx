import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function LocateButton({ setLatitude, setLongitude }) {
  const map = useMap();

  useEffect(() => {
    const locateControl = L.control({ position: "topleft" });

    locateControl.onAdd = function () {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

      const button = L.DomUtil.create("a", "", div);
      button.innerHTML = "📍";
      button.href = "#";
      button.title = "Use Current Location";

      L.DomEvent.on(button, "click", function (e) {
        L.DomEvent.preventDefault(e);
        map.locate();
      });

      return div;
    };

    locateControl.addTo(map);

    const onLocationFound = (e) => {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    };

    map.on("locationfound", onLocationFound);

    return () => {
      map.off("locationfound", onLocationFound);
      locateControl.remove();
    };
  }, [map]);

  return null; // This component does not render JSX directly
}
