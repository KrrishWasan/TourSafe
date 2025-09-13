import React, { useState, useEffect } from 'react';
import { Users, MapPin, AlertTriangle, Activity, Shield, Eye, FileText, Radio, Search, Filter } from 'lucide-react';

const AuthorityDashboard = ({ onNavigate }) => {
  const [activeTourists, setActiveTourists] = useState(1247);
  const [activeAlerts, setActiveAlerts] = useState(3);
  const [resolvedToday, setResolvedToday] = useState(12);
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const tourists = [
    { id: 'TID-1001', name: 'John Smith', location: 'Kaziranga National Park', status: 'safe', lastUpdate: '2 min ago', safetyScore: 92, nationality: 'USA' },
    { id: 'TID-1002', name: 'Priya Sharma', location: 'Shillong', status: 'alert', lastUpdate: '5 min ago', safetyScore: 65, nationality: 'India' },
    { id: 'TID-1003', name: 'Mike Johnson', location: 'Tawang', status: 'safe', lastUpdate: '1 min ago', safetyScore: 88, nationality: 'UK' },
    { id: 'TID-1004', name: 'Anita Devi', location: 'Kohima', status: 'caution', lastUpdate: '8 min ago', safetyScore: 74, nationality: 'India' },
    { id: 'TID-1005', name: 'David Chen', location: 'Mawlynnong Village', status: 'safe', lastUpdate: '3 min ago', safetyScore: 91, nationality: 'Singapore' },
  ];

  const alerts = [
    { id: 1, type: 'geo-fence', tourist: 'Priya Sharma', touristId: 'TID-1002', location: 'Restricted Zone - Dawki Border', time: '5 min ago', severity: 'high', status: 'active' },
    { id: 2, type: 'anomaly', tourist: 'Mike Johnson', touristId: 'TID-1003', location: 'Tawang Monastery', time: '15 min ago', severity: 'medium', status: 'investigating' },
    { id: 3, type: 'inactivity', tourist: 'Sarah Wilson', touristId: 'TID-1006', location: 'Mawlynnong Village', time: '32 min ago', severity: 'low', status: 'resolved' },
    { id: 4, type: 'panic', tourist: 'Tourist Demo', touristId: 'TID-1007', location: 'Kaziranga National Park', time: '1 min ago', severity: 'high', status: 'responding' },
  ];

  const regions = [
    { name: 'Assam', tourists: 456, alerts: 2, color: 'bg-green-500' },
    { name: 'Arunachal Pradesh', tourists: 189, alerts: 1, color: 'bg-yellow-500' },
    { name: 'Meghalaya', tourists: 234, alerts: 0, color: 'bg-green-500' },
    { name: 'Manipur', tourists: 123, alerts: 0, color: 'bg-green-500' },
    { name: 'Mizoram', tourists: 89, alerts: 0, color: 'bg-green-500' },
    { name: 'Nagaland', tourists: 98, alerts: 0, color: 'bg-green-500' },
    { name: 'Tripura', tourists: 58, alerts: 0, color: 'bg-green-500' },
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTourists(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'alert': return 'bg-red-100 text-red-800';
      case 'caution': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'geo-fence': return '🚫';
      case 'anomaly': return '🔍';
      case 'inactivity': return '⏰';
      case 'panic': return '🚨';
      default: return '⚠️';
    }
  };

  const handleGenerateEFIR = (tourist) => {
    alert(`E-FIR Generated for ${tourist.name}\n\nFIR Number: ${Math.random().toString(36).substr(2, 8).toUpperCase()}\nStatus: Filed\n\nAutomated report sent to local police station.`);
  };

  const filteredTourists = tourists.filter(tourist =>
    tourist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tourist.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tourist.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Authority Dashboard</h1>
              <p className="text-gray-600">Northeast Tourist Safety Monitoring Center</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region.name} value={region.name.toLowerCase()}>
                    {region.name}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FileText className="h-4 w-4 inline mr-2" />
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Tourists</p>
                <p className="text-2xl font-bold text-gray-900">{activeTourists.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{activeAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-gray-900">{resolvedToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
                <p className="text-2xl font-bold text-gray-900">87.3%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tourist Heat Map */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <MapPin className="h-5 w-5 inline mr-2" />
                Tourist Heat Map - Northeast India
              </h2>
              <div className="bg-gray-100 rounded-lg p-8" style={{ height: '350px' }}>
                <div className="relative w-full h-full bg-green-50 rounded-lg overflow-hidden">
                  {/* Simulated Heat Map */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 opacity-60"></div>
                  
                  {/* Heat Map Dots */}
                  {regions.map((region, index) => (
                    <div
                      key={region.name}
                      className={`absolute w-4 h-4 rounded-full ${region.color} opacity-80`}
                      style={{
                        left: `${20 + (index * 12)}%`,
                        top: `${15 + (index * 8)}%`
                      }}
                      title={`${region.name}: ${region.tourists} tourists`}
                    ></div>
                  ))}

                  <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md">
                    <p className="text-sm font-medium text-gray-900 mb-2">Legend</p>
                    <div className="flex space-x-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                        <span>Safe</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                        <span>Caution</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                        <span>Alert</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tourist List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  <Users className="h-5 w-5 inline mr-2" />
                  Tourist Monitoring
                </h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tourists..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Tourist</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Safety Score</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Last Update</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTourists.map((tourist) => (
                      <tr key={tourist.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{tourist.name}</p>
                            <p className="text-sm text-gray-600">{tourist.id}</p>
                            <p className="text-xs text-gray-500">{tourist.nationality}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-900">{tourist.location}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tourist.status)}`}>
                            {tourist.status.charAt(0).toUpperCase() + tourist.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${tourist.safetyScore >= 85 ? 'bg-green-500' : tourist.safetyScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                style={{ width: `${tourist.safetyScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{tourist.safetyScore}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{tourist.lastUpdate}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleGenerateEFIR(tourist)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <AlertTriangle className="h-5 w-5 inline mr-2" />
                Active Alerts
              </h3>
              <div className="space-y-3">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="mr-2">{getAlertIcon(alert.type)}</span>
                          <span className="text-sm font-medium">{alert.type.replace('-', ' ').toUpperCase()}</span>
                        </div>
                        <p className="text-sm text-gray-700">{alert.tourist}</p>
                        <p className="text-xs text-gray-600">{alert.location}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                        alert.status === 'responding' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Overview</h3>
              <div className="space-y-3">
                {regions.map((region) => (
                  <div key={region.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${region.color}`}></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{region.name}</p>
                        <p className="text-xs text-gray-600">{region.tourists} tourists</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{region.alerts}</p>
                      <p className="text-xs text-gray-600">alerts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IoT Network Status */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Radio className="h-5 w-5 inline mr-2" />
                IoT Network Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Smart Bands</p>
                    <p className="text-xs text-gray-600">1,089 connected</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">GPS Trackers</p>
                    <p className="text-xs text-gray-600">1,247 active</p>
                  </div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Beacon Network</p>
                    <p className="text-xs text-gray-600">156 of 160 online</p>
                  </div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;