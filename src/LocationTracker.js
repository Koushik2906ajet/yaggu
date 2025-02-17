import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://node-server-p4ifwkck8-koushik2906ajets-projects.vercel.app/update-location"; // Replace with deployed backend URL

export default function DriverApp() {
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("Requesting location...");

  // ✅ Get the location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatus("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        setStatus("✅ Location Granted");

        // Send location immediately
        sendLocationToServer(latitude, longitude);
      },
      (error) => {
        setStatus(`❌ Location Error: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
    );
  };

  // ✅ Send location to backend
  const sendLocationToServer = async (latitude, longitude) => {
    try {
      await axios.post(API_URL, { latitude, longitude });
      console.log("📡 Location sent to server:", { latitude, longitude });
    } catch (error) {
      console.error("❌ Error sending location:", error);
    }
  };

  useEffect(() => {
    getLocation(); // Get initial location when the component loads

    // Re-fetch and send location every 30 seconds
    const interval = setInterval(() => {
      getLocation(); // Re-fetch location every 30 seconds
    }, 30000); // 30 seconds (30,000 ms)

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold">Driver Location Tracker 🚖</h2>
      <p className="mt-2">{status}</p>
      {location && (
        <p className="mt-2">
          <strong>Latitude:</strong> {location.latitude} <br />
          <strong>Longitude:</strong> {location.longitude}
        </p>
      )}
    </div>
  );
}
