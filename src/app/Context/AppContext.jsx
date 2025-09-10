"use client";
import React, { createContext, useContext, useState } from "react";

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  // 🔹 Example global states
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null); // for logged-in user
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classrooms, setClassrooms] = useState([]); // store classroom data
  const [activePage, setActivePage] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [TapssidebarOpen, setTapsSidebarOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        user,
        setUser,
        isLogin, setIsLogin,
        classrooms,
        setClassrooms,
        activePage, setActivePage
        , activeTab, setActiveTab,
        TapssidebarOpen, setTapsSidebarOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy usage
export const useAppContext = () => useContext(AppContext);
