import React, { useState } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import Registration from './components/Registration';
import TouristDashboard from './components/TouristDashboard';
import AuthorityDashboard from './components/AuthorityDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.type === 'tourist') {
      setCurrentPage('tourist-dashboard');
    } else if (userData.type === 'authority') {
      setCurrentPage('authority-dashboard');
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'registration':
        return <Registration onNavigate={handleNavigate} />;
      case 'tourist-dashboard':
        return <TouristDashboard onNavigate={handleNavigate} user={user} />;
      case 'authority-dashboard':
        return <AuthorityDashboard onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        user={user}
        onLogout={() => {
          setUser(null);
          setCurrentPage('landing');
        }}
      />
      {renderPage()}
    </div>
  );
}

export default App;