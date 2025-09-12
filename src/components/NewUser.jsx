import React, { useState } from "react";
import Registration from "./Registration";
import LandingPage from "./LandingPage";

const App = () => {
  const [page, setPage] = useState("registration"); // or 'landing'
  const [users, setUsers] = useState([]); // store registered users
  const [currentUser, setCurrentUser] = useState(null);

  // When user finishes registration
  const handleRegistration = (userData) => {
    setUsers((prev) => [...prev, userData]);
    setPage("landing"); // navigate
  };

  // When user logs in
  const handleLogin = (user) => {
    setCurrentUser(user);
    setPage("dashboard"); // later you can make a dashboard page
  };

  return (
    <>
      {page === "registration" && (
        <Registration onRegister={handleRegistration} />
      )}
      {page === "landing" && (
        <LandingPage users={users} onLogin={handleLogin} />
      )}
      {page === "dashboard" && currentUser && (
        <div className="p-10">
          <h1>Welcome {currentUser.fullName || currentUser.name} 🎉</h1>
          <pre>{JSON.stringify(currentUser, null, 2)}</pre>
        </div>
      )}
    </>
  );
};

export default App;
