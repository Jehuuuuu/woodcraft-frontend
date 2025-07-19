import { useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";

export default function DraggableMarker({
  position,
  setLatitude,
  setLongitude,
}) {
  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          setLatitude(position.lat.toString());
          setLongitude(position.lng.toString());
        }
      },
    }),
    []
  );

  return (
    <Marker
      draggable={true}
      ref={markerRef}
      position={position}
      eventHandlers={eventHandlers}
    >
      <Popup>
        <b>Your address is here.</b> <br /> Place the pin to your exact
        location.
      </Popup>
    </Marker>
  );
}
