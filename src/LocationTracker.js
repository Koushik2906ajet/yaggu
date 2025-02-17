import { useState, useEffect } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "400px" };
const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // Default to India

export default function LocationMap() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Requesting location...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setStatus("Location Granted ✅");
        },
        (err) => {
          setStatus("Location Denied ❌");
          setError(err.message);
        }
      );
    } else {
      setStatus("Geolocation Not Supported ❌");
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold">Location Tracker</h2>
      <p className="mt-2">{status}</p>
      {location ? (
        <>
          <p className="mt-2">
            <strong>Latitude:</strong> {location.lat} <br />
            <strong>Longitude:</strong> {location.lng}
          </p>
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={15}>
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>
        </>
      ) : (
        error && <p className="mt-2 text-red-500">{error}</p>
      )}
    </div>
  );
}
