import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Phone, Bell, Activity, Navigation, Radio, Users, AlertTriangle, Battery } from 'lucide-react';
import MapComponent from './MapComponent';

const TouristDashboard = ({ onNavigate, user }) => {
  const [safetyScore, setSafetyScore] = useState(user?.safetyScore || 92);
  const [currentLocation, setCurrentLocation] = useState('Kaziranga National Park');
  const [alertsCount, setAlertsCount] = useState(0);
  const [isTracking, setIsTracking] = useState(true);
  const [emergencyContacts] = useState([
    { name: 'Local Police', number: '100', type: 'police' },
    { name: 'Tourist Helpline', number: '1363', type: 'tourism' },
    { name: 'Emergency Contact', number: '+91 98765 43210', type: 'personal' }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSafetyScore(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newScore = Math.max(60, Math.min(100, prev + change));
        return newScore;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePanicButton = () => {
    setAlertsCount(prev => prev + 1);
    alert('🚨 PANIC ALERT SENT!\n\nYour location has been shared with:\n- Nearest police station\n- Emergency contacts\n- Tourism authorities\n\nHelp is on the way!');
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
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-full font-semibold ${getSafetyColor(safetyScore)}`}>
                <Shield className="h-5 w-5 inline mr-2" />
                {getSafetyStatus(safetyScore)} ({safetyScore}%)
              </div>
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
              <MapComponent user={user} />
            </div>

            {/* Activity Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <Activity className="h-5 w-5 inline mr-2" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entered safe zone: Kaziranga National Park</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Check-in: Wildlife Safari Booking Confirmed</p>
                    <p className="text-xs text-gray-500">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Weather Alert: Light rain expected this evening</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location shared with emergency contact</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
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
                Tap to instantly alert authorities and emergency contacts
              </p>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contacts</h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.number}</p>
                    </div>
                    <button className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Phone className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* IoT Device Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Radio className="h-5 w-5 inline mr-2" />
                IoT Devices
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Smart Band</p>
                    <p className="text-xs text-gray-500">Health monitoring active</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Battery className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-green-600">85%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">GPS Tracker</p>
                    <p className="text-xs text-gray-500">Location services on</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Safety Settings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Real-time Tracking</span>
                  <button
                    onClick={() => setIsTracking(!isTracking)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      isTracking ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-transform ${
                      isTracking ? 'translate-x-6' : 'translate-x-1'
                    }`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Geo-fence Alerts</span>
                  <button className="relative w-11 h-6 bg-blue-600 rounded-full">
                    <div className="absolute w-4 h-4 bg-white rounded-full top-1 translate-x-6"></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Voice Notifications</span>
                  <button className="relative w-11 h-6 bg-blue-600 rounded-full">
                    <div className="absolute w-4 h-4 bg-white rounded-full top-1 translate-x-6"></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Days in Northeast</span>
                  <span className="text-sm font-semibold text-gray-900">3 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Places Visited</span>
                  <span className="text-sm font-semibold text-gray-900">5 locations</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Safety Incidents</span>
                  <span className="text-sm font-semibold text-green-600">0 incidents</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Community Rating</span>
                  <span className="text-sm font-semibold text-blue-600">4.8/5 ⭐</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TouristDashboard;