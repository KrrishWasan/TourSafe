import React, { useState } from 'react';
import { Shield, Smartphone, Brain, MapPin, Radio, Globe, AlertTriangle, Users, CheckCircle, ArrowRight, Play } from 'lucide-react';

const LandingPage = ({ onNavigate, onLogin }) => {
  const [loginType, setLoginType] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const features = [
    {
      icon: Shield,
      title: 'Digital Tourist ID',
      description: 'Blockchain-based secure digital identity generation at entry points with KYC verification.'
    },
    {
      icon: Smartphone,
      title: 'Mobile Safety App',
      description: 'Real-time safety scoring, geo-fencing alerts, and panic button with live location sharing.'
    },
    {
      icon: Brain,
      title: 'AI Anomaly Detection',
      description: 'Smart detection of unusual patterns, route deviations, and potential distress situations.'
    },
    {
      icon: MapPin,
      title: 'Real-time Monitoring',
      description: 'Live dashboards with tourist heat maps, risk zone visualization, and location tracking.'
    },
    {
      icon: Radio,
      title: 'IoT Integration',
      description: 'Smart wearable devices for continuous health monitoring and emergency SOS features.'
    },
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Available in 10+ Indian languages with voice emergency access for all users.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Registered Tourists', icon: Users },
    { number: '99.8%', label: 'Safety Success Rate', icon: CheckCircle },
    { number: '24/7', label: 'Emergency Response', icon: AlertTriangle },
    { number: '7', label: 'Northeast States', icon: MapPin }
  ];

  const handleLogin = (e) => {
   e.preventDefault();
   const foundUser = users.find(
     (u) => u.email === credentials.username && u.phone === credentials.password
   );

   if (foundUser) {
     onLogin(foundUser);
   } else if (
     credentials.username === "authority" &&
     credentials.password === "demo"
   ) {
     onLogin({
       name: "Officer Singh",
       type: "authority",
       department: "Northeast Tourism Safety",
       badge: "TSO-1001",
     });
   } else {
     alert("Invalid credentials. Try registered email/phone or authority/demo");
   }
 };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Shield className="h-12 w-12 text-blue-300 mr-4" />
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold mb-2">
                    Smart Tourist
                    <span className="text-blue-300"> Safety</span>
                  </h1>
                  <p className="text-xl text-blue-200">Northeast India Monitoring System</p>
                </div>
              </div>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Advanced AI, Blockchain, and IoT-powered platform ensuring complete safety and security 
                for tourists exploring the beautiful Northeast regions of India.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('registration')}
                  className="flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors group"
                >
                  Get Digital Tourist ID
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button
                  onClick={() => setShowLoginForm(!showLoginForm)}
                  className="flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Login Safely
                </button>
              </div>

              {showLoginForm && (
                <div className="mt-6 mx-auto w-2/3 p-6 bg-white/10 backdrop-blur-sm rounded-lg">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">Login Type</label>
                      <select
                        value={loginType}
                        onChange={(e) => setLoginType(e.target.value)}
                        className="w-full px-4 py-2 bg-white/20 text-white placeholder-blue-200 rounded-lg border border-white/30 focus:ring-2 focus:ring-blue-300"
                        required
                      >
                        <option value="">Select Login Type</option>
                        <option className='text-yellow-500' value="tourist">Tourist Dashboard</option>
                        <option className='text-yellow-500' value="authority">Authority Dashboard</option>
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                        className="w-full px-4 py-2 bg-white/20 text-white placeholder-blue-200 rounded-lg border border-white/30 focus:ring-2 focus:ring-blue-300"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                        className="w-full px-4 py-2 bg-white/20 text-white placeholder-blue-200 rounded-lg border border-white/30 focus:ring-2 focus:ring-blue-300"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      Login
                    </button>
                  </form>
                  <p className="text-xs text-blue-200 mt-2">
                    
                  </p>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="text-center p-4 bg-white/10 rounded-lg">
                        <IconComponent className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white">{stat.number}</div>
                        <div className="text-sm text-blue-200">{stat.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Safety Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced technology stack ensures complete protection and peace of mind for tourists 
              and authorities across Northeast India.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="group hover:shadow-xl transition-all duration-300 p-8 rounded-2xl border border-gray-100 hover:border-blue-200">
                  <div className="flex items-center mb-6">
                    <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-600 transition-colors">
                      <IconComponent className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 ml-4">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Experience Safe Tourism?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of tourists who trust SafeTourismNE for their Northeast India adventures.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('registration')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Register as Tourist
            </button>
            <button
              onClick={() => setShowLoginForm(!showLoginForm)}
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Authority Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;