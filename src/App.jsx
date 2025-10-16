import React, { useState } from "react";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Registration from "./components/Registration";
import TouristDashboard from "./components/TouristDashboard";
import AuthorityDashboard from "./components/AuthorityDashboard";
import { UserProvider, useUser } from "./UserContext";
import PanicButton from "./components/PanicButton";
import MapComponent from "./components/MapComponent";
import PlaceStats from "./PlaceStats"; // Add this import

// ✅ Separated out AppContent so UserProvider can wrap everything
function AppContent() {
  const [currentPage, setCurrentPage] = useState("landing");
  const { user, setUser } = useUser();

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.type === "tourist") {
      setCurrentPage("tourist-dashboard");
    } else if (userData.type === "authority") {
      setCurrentPage("authority-dashboard");
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return (
          <LandingPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case "registration":
        return <Registration onNavigate={handleNavigate} />;
      case "tourist-dashboard":
        return <TouristDashboard onNavigate={handleNavigate} user={user} />;
      case "authority-dashboard":
        return <AuthorityDashboard onNavigate={handleNavigate} />;
      default:
        return (
          <LandingPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
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
          setCurrentPage("landing");
        }}
      />
      {renderPage()}
      {/* <TouristDashboard />
      <PlaceStats />  */}
    </div>
  );
}

// ✅ Wrap AppContent in UserProvider
function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
