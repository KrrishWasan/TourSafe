import React, { useState, useEffect, useRef } from 'react';
import { MapPin, AlertTriangle, Shield, Navigation, Zap } from 'lucide-react';

const MapComponent = ({ user }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDangers, setNearbyDangers] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 26.1445, lng: 91.7362 }); // Guwahati center
  const [selectedDanger, setSelectedDanger] = useState(null);
  const mapRef = useRef(null);

  // Simulated danger zones in Northeast India
  const dangerZones = [
    {
      id: 1,
      name: 'Restricted Border Area',
      type: 'restricted',
      lat: 26.1234,
      lng: 91.7456,
      radius: 2000, // 2km
      severity: 'high',
      description: 'India-Bangladesh border - Restricted access area',
      action: 'Immediate evacuation required'
    },
    {
      id: 2,
      name: 'Wildlife Crossing Zone',
      type: 'wildlife',
      lat: 26.1567,
      lng: 91.7123,
      radius: 1500,
      severity: 'medium',
      description: 'Elephant crossing area - Exercise caution',
      action: 'Maintain safe distance from wildlife'
    },
    {
      id: 3,
      name: 'Flood Prone Area',
      type: 'natural',
      lat: 26.1345,
      lng: 91.7234,
      radius: 1000,
      severity: 'low',
      description: 'Area prone to seasonal flooding',
      action: 'Monitor weather conditions'
    },
    {
      id: 4,
      name: 'Landslide Risk Zone',
      type: 'natural',
      lat: 26.1678,
      lng: 91.7567,
      radius: 800,
      severity: 'high',
      description: 'Recent heavy rains - Landslide risk',
      action: 'Avoid this route - Use alternative path'
    }
  ];

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          setUserLocation(location);
          setMapCenter(location);
          checkNearbyDangers(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          // For demo, use a location in Guwahati
          const demoLocation = { lat: 26.1445, lng: 91.7362 };
          setUserLocation(demoLocation);
          checkNearbyDangers(demoLocation);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, []);

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c * 1000; // Convert to meters
  };

  // Check for nearby dangers
  const checkNearbyDangers = (currentLocation) => {
    const nearby = dangerZones.filter(zone => {
      const distance = calculateDistance(
        currentLocation.lat, 
        currentLocation.lng, 
        zone.lat, 
        zone.lng
      );
      return distance <= zone.radius;
    });

    setNearbyDangers(nearby);

    // Show alerts for high severity dangers
    nearby.forEach(danger => {
      if (danger.severity === 'high') {
        showDangerAlert(danger);
      }
    });
  };

  // Show danger alert
  const showDangerAlert = (danger) => {
    // In a real app, this would be a proper notification system
    if (window.Notification && Notification.permission === 'granted') {
      new Notification(`⚠️ Safety Alert: ${danger.name}`, {
        body: danger.description,
        icon: '/favicon.ico'
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityTextColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Map Container */}
      <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        {/* Simulated Map View */}
        <div className="relative w-full h-full bg-green-100">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #10B981,
                #10B981 10px,
                #059669 10px,
                #059669 20px
              )`
            }}></div>
          </div>

          {/* User Location */}
          {userLocation && (
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{
                left: `${50}%`, // Center for demo
                top: `${50}%`   // Center for demo
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-200 rounded-full opacity-50 animate-ping"></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                  You are here
                </div>
              </div>
            </div>
          )}

          {/* Danger Zones */}
          {dangerZones.map((zone) => {
            const isNearby = nearbyDangers.some(d => d.id === zone.id);
            return (
              <div
                key={zone.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  isNearby ? 'z-30' : 'z-10'
                }`}
                style={{
                  left: `${30 + (zone.id * 15)}%`,
                  top: `${20 + (zone.id * 20)}%`
                }}
                onClick={() => setSelectedDanger(zone)}
              >
                {/* Danger Zone Circle */}
                <div className={`w-16 h-16 rounded-full opacity-30 ${getSeverityColor(zone.severity)} ${
                  isNearby ? 'animate-pulse' : ''
                }`}></div>
                
                {/* Danger Icon */}
                <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${getSeverityColor(zone.severity)} rounded-full flex items-center justify-center`}>
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>

                {/* Zone Label */}
                <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium ${getSeverityTextColor(zone.severity)} whitespace-nowrap`}>
                  {zone.name}
                </div>
              </div>
            );
          })}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 space-y-2">
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
              <Navigation className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50">
              <Zap className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Nearby Dangers Alert Panel */}
      {nearbyDangers.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800">⚠️ Danger Zones Nearby</h3>
              <div className="mt-2 space-y-2">
                {nearbyDangers.map((danger) => (
                  <div key={danger.id} className="text-sm text-red-700">
                    <strong>{danger.name}</strong> - {danger.description}
                    <div className="text-xs text-red-600 mt-1">
                      Action: {danger.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Danger Details */}
      {selectedDanger && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedDanger(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{selectedDanger.name}</h3>
              <button
                onClick={() => setSelectedDanger(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">Type:</span>
                <span className="text-sm text-gray-900 capitalize">{selectedDanger.type}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-500 mr-2">Severity:</span>
                <span className={`text-sm font-medium capitalize ${getSeverityTextColor(selectedDanger.severity)}`}>
                  {selectedDanger.severity}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Description:</span>
                <p className="text-sm text-gray-900 mt-1">{selectedDanger.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Recommended Action:</span>
                <p className="text-sm text-gray-900 mt-1">{selectedDanger.action}</p>
              </div>
            </div>
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setSelectedDanger(null)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Acknowledge
              </button>
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Report Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Location Status */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {userLocation ? 'Location: Active' : 'Location: Getting position...'}
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 mr-1" />
          Safety Score: {user?.safetyScore || 85}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;