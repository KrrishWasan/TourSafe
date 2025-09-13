import React, { createContext, useState, useContext } from "react";

// 1️⃣ Create the Context
const UserContext = createContext();

// 2️⃣ Create the Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // logged-in user
  const [users, setUsers] = useState([]); // all registered tourists

  // Add a new user
  const addUser = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
  };

  return (
    <UserContext.Provider value={{ user, setUser, users, addUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 3️⃣ Custom hook to consume context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
