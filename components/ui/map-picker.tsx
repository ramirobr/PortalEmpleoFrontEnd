"use client";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  MapMouseEvent,
} from "@vis.gl/react-google-maps";

type LatLng = { lat: number; lng: number };

type MapPickerProps = {
  value?: LatLng | null;
  onChange: (coords: LatLng) => void;
  defaultCenter?: LatLng;
  className?: string;
};

const ECUADOR_CENTER: LatLng = { lat: -1.8312, lng: -78.1834 };

export default function MapPicker({
  value,
  onChange,
  defaultCenter = ECUADOR_CENTER,
  className,
}: MapPickerProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const handleClick = (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    onChange({ lat: e.detail.latLng.lat, lng: e.detail.latLng.lng });
  };

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className ?? "w-full h-64 rounded-lg overflow-hidden border"}>
        <Map
          defaultCenter={value ?? defaultCenter}
          defaultZoom={value ? 14 : 6}
          mapId="map-picker"
          onClick={handleClick}
          gestureHandling="cooperative"
          disableDefaultUI
          zoomControl
        >
          {value && <AdvancedMarker position={value} />}
        </Map>
      </div>
    </APIProvider>
  );
}
