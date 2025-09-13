import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.5rem',
};

const defaultCenter = { lat: 26.1445, lng: 91.7362 }; // Default center (Guwahati)

const PanicMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBIzyU04U5XEshHQRhLjJRmCj3XGhr9BV4"
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    const success = (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(location);
      if (mapRef.current) {
        mapRef.current.panTo(location);
        mapRef.current.setZoom(17);
      }
    };

    const error = (err) => {
      console.error('Error getting location:', err);
    };

    // Get initial location
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
    });

    // Enable live tracking
    const watchId = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
    });
    watchIdRef.current = watchId;

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  if (!isLoaded) return <div className="text-center mt-10">Loading Map...</div>;

  return (
    <div className="w-full h-[500px] rounded-lg shadow-md">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={userLocation ? 17 : 5}
        onLoad={onMapLoad}
      >
        {userLocation && <Marker position={userLocation} title="You are here" />}
      </GoogleMap>
    </div>
  );
};

export default PanicMap;
