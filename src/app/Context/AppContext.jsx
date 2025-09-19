"use client";
import React, { createContext, useContext, useState } from "react";

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  // 🔹 Example global states
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [TapssidebarOpen, setTapsSidebarOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState(null);
  const [classrooms, setClassrooms] = useState(null);
  const [plans, setPlans] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [pendingUsers, setpendingUsers] = useState(null);
  const [studentsClass, setStudentsClass] = useState(null);
  const [pdfsClass, setPdfsClass] = useState(null);
  const [tasksClass, setTasksClass] = useState(null);
  const [subtasksClass, setSubTasksClass] = useState(null);
  const [notesClass, setNotesClass] = useState(null);
  const [classData, setClassData] = useState(null);
  const [classid,setClassid] = useState(null);

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
        TapssidebarOpen, setTapsSidebarOpen,
        students, setStudents,
        plans, setPlans,
        transactions, setTransactions,
        pendingUsers, setpendingUsers,
        studentsClass, setStudentsClass,
        pdfsClass, setPdfsClass,
        tasksClass, setTasksClass,
        subtasksClass, setSubTasksClass,
        notesClass, setNotesClass,
        classData, setClassData,
        classid,setClassid
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy usage
export const useAppContext = () => useContext(AppContext);
