import React, { useState, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = { lat: 20, lng: 77 }; // Default to India center

const PanicButton = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [trackingEnabled, setTrackingEnabled] = useState(false);
  const [trackingStatus, setTrackingStatus] = useState("");
  const [output, setOutput] = useState("");
  const [policeStations, setPoliceStations] = useState([]);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBIzyU04U5XEshHQRhLjJRmCj3XGhr9BV4",
    libraries: ["places"],
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setOutput("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setOutput(
          `Your Location: Lat ${location.lat.toFixed(
            6
          )}, Lng ${location.lng.toFixed(6)} (Accuracy: ±${Math.round(position.coords.accuracy)} m)`
        );
        if (mapRef.current) {
          mapRef.current.panTo(location);
          mapRef.current.setZoom(15);
        }
      },
      (err) => {
        console.error(err);
        setOutput("Error: Unable to retrieve location. Please allow location access.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Toggle real-time tracking
  const toggleTracking = () => {
    setTrackingEnabled((prev) => !prev);

    if (!trackingEnabled) {
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            setTrackingStatus("Real-time tracking enabled.");
            if (mapRef.current) mapRef.current.panTo(location);
            sendLocationToServer(location);
          },
          (err) => {
            console.error(err);
            setTrackingStatus("Unable to start real-time tracking.");
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
        watchIdRef.current = id;
      }
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setTrackingStatus("Real-time tracking disabled.");
    }
  };

  // Simulate sending location to server
  const sendLocationToServer = (location) => {
    console.log("Sending location to server:", location);
  };

  // Find nearby police stations
  const findNearbyPolice = () => {
    if (!userLocation || !mapRef.current) {
      setOutput("Please get your location first!");
      return;
    }

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: userLocation,
      radius: 5000,
      keyword: "police station",
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        const topStations = results.slice(0, 3);
        setPoliceStations(topStations);

        let outputText = `Your Location: Lat ${userLocation.lat.toFixed(
          6
        )}, Lng ${userLocation.lng.toFixed(6)}\n\nNearby Police Stations:\n`;

        topStations.forEach((place, i) => {
          outputText += `${i + 1}. ${place.name} (${place.vicinity})\n`;
        });

        setOutput(outputText);
      } else {
        setOutput("No nearby police stations found.");
        setPoliceStations([]);
      }
    });
  };

  if (!isLoaded) return <div className="text-center mt-10">Loading Map...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">Panic Button App</h1>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        <button
          onClick={getUserLocation}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Get My Location
        </button>
        <button
          onClick={findNearbyPolice}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
        >
          Panic Button
        </button>
      </div>

      <div className="mb-4">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            checked={trackingEnabled}
            onChange={toggleTracking}
            className="form-checkbox h-5 w-5 text-green-600"
          />
          <span className="text-gray-700">
            Enable Real-Time Tracking (opt-in for family/law enforcement)
          </span>
        </label>
      </div>

      <div className="mb-4 text-green-600 font-semibold">{trackingStatus}</div>

      <div className="w-full h-96 mb-4">
        <GoogleMap
          mapContainerClassName="w-full h-full rounded-lg shadow-md"
          center={userLocation || defaultCenter}
          zoom={userLocation ? 15 : 5}
          onLoad={onMapLoad}
        >
          {userLocation && <Marker position={userLocation} title="Your Location" />}
          {policeStations.map((station, idx) => (
            <Marker
              key={idx}
              position={station.geometry.location}
              title={station.name}
              icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            />
          ))}
        </GoogleMap>
      </div>

      <pre className="text-left bg-gray-100 p-4 rounded-lg shadow-inner whitespace-pre-wrap">{output}</pre>
    </div>
  );
};

export default PanicButton;

