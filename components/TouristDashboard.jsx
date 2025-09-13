import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, MapPin, Phone, Activity } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const TouristDashboard = ({ user }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPolice, setNearbyPolice] = useState([]);
  const [safetyScore, setSafetyScore] = useState(user?.safetyScore || 92);
  const mapRef = useRef(null);

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBIzyU04U5XEshHQRhLjJRmCj3XGhr9BV4",
    libraries: ['places'],
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (userLocation) {
      map.panTo(userLocation);
      map.setZoom(15);
    }
  }, [userLocation]);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchNearbyPolice(location);
        },
        (err) => {
          console.error('Unable to fetch location:', err);
          alert('⚠️ Unable to get your current location. Please enable location services.');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('⚠️ Geolocation is not supported by your browser.');
    }
  }, []);

  // Simulate safety score updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSafetyScore((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.max(60, Math.min(100, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch nearby police stations
  const fetchNearbyPolice = (location) => {
    if (!window.google || !mapRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapRef.current);
    const request = {
      location: location,
      radius: 5000, // 5km
      keyword: 'police station',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
        setNearbyPolice(results.slice(0, 5)); // top 5
      } else {
        setNearbyPolice([]);
      }
    });
  };

  const handlePanicButton = () => {
    alert(`🚨 PANIC ALERT SENT!\nYour location has been shared with:\n- Nearest police stations\n- Authorities`);
  };

  const getSafetyColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSafetyStatus = (score) => {
    if (score >= 85) return 'Safe';
    if (score >= 70) return 'Caution';
    return 'At Risk';
  };

  if (!isLoaded) return <div className="text-center mt-10">Loading Map...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}</h1>
              <p className="text-gray-600">Tourist ID: {user?.id}</p>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getSafetyColor(safetyScore)}`}>
              <Shield className="h-5 w-5 inline mr-2" />
              {getSafetyStatus(safetyScore)} ({safetyScore}%)
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Safety Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <MapPin className="h-5 w-5 inline mr-2" />
                Safety Map & Location
              </h2>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || { lat: 0, lng: 0 }}
                zoom={userLocation ? 15 : 2}
                onLoad={onMapLoad}
              >
                {userLocation && <Marker position={userLocation} title="You are here" />}
                {nearbyPolice.map((station, idx) => (
                  <Marker
                    key={idx}
                    position={station.geometry.location}
                    title={station.name}
                    icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  />
                ))}
              </GoogleMap>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <Activity className="h-5 w-5 inline mr-2" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entered safe zone</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Panic Button */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency</h3>
              <button
                onClick={handlePanicButton}
                className="w-full py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors shadow-lg animate-pulse"
              >
                <Phone className="h-6 w-6 inline mr-2" />
                PANIC BUTTON
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Tap to instantly alert authorities and nearest police stations
              </p>
            </div>

            {/* Nearby Police Stations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Police Stations</h3>
              {nearbyPolice.length > 0 ? (
                <div className="space-y-2">
                  {nearbyPolice.map((station, idx) => (
                    <div key={idx} className="p-2 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{station.name}</p>
                      <p className="text-xs text-gray-500">{station.vicinity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Fetching nearby police stations...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;
