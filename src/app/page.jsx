'use client'
import { useEffect } from "react";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaChartBar,
  FaBars,
  FaTimes,
  FaChalkboardTeacher,
  FaUserGraduate,
  FaClipboardList,
} from "react-icons/fa";
import Classrooms from "./Components/Classrooms";
import DashboardHome from "./Components/DashboardHome";
import Plans from "./Components/Plans";
import Profile from "./Components/Profile";
import Reports from "./Components/Reports";
import Students from "./Components/Students";
import { useAppContext } from "./Context/AppContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { sidebarOpen, setSidebarOpen, isLogin, setIsLogin, user, setUser,activePage, setActivePage } = useAppContext();
  const router = useRouter();

  const classrooms = [
    { 
      name: "Math Class", 
      id: "ABC123", 
      students: 25, 
      createdAt: "2025-09-01",
      videos: 12,
      files: 8,
      tasks: 5
    },
    { 
      name: "Science Class", 
      id: "XYZ789", 
      students: 18, 
      createdAt: "2025-08-20",
      videos: 6,
      files: 3,
      tasks: 2
    },
    { 
      name: "History Class", 
      id: "HIS456", 
      students: 30, 
      createdAt: "2025-09-05",
      videos: 9,
      files: 7,
      tasks: 4
    },
  ];  

  const handleLogout = () => {
    setIsLogin(false);
    setUser(null);
    localStorage.removeItem("token");
    router.push("/Pages/Auth/login");
  };

  const renderContent = () => {
    switch (activePage) {
      case "students":
        return <Students />;
      case "classrooms":
        return <Classrooms />;
      case "reports":
        return <Reports />;
      case "plans":
        return <Plans />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardHome classrooms={classrooms} />; // ✅ pass data
    }
  };

  const handleRouting = (path) => {
    setSidebarOpen(false);
    setActivePage(path);
  }

  // Protect route
  useEffect(() => {
    if (!isLogin || !user) {
      router.push("/Pages/Auth/login");
    }
  }, [isLogin, user]);

  return (
    <div className="h-screen flex bg-[#090909] text-white" dir="rtl">
      {/* الشريط الجانبي */}
      <aside
        className={`fixed md:static top-0 right-0 h-screen w-64 bg-[#1a1a1a] p-6 flex flex-col transform transition-transform duration-300 z-50
        ${sidebarOpen ? "translate-x-0" : "translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 text-[#1998e1] text-xl self-end cursor-pointer mb-4"
        >
          <FaTimes />
        </button>

        <h1 className="text-2xl font-bold text-[#1998e1] mb-8">لوحة التحكم</h1>

        <nav className="flex-1">
          <ul className="space-y-4">
            <li
              onClick={() => handleRouting("home")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300 ${activePage === "home" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaHome className="text-[#1998e1]" /> الرئيسية
            </li>
            <li
              onClick={() => handleRouting("students")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "students" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaUserGraduate className="text-[#1998e1]" /> الطلاب
            </li>
            <li
              onClick={() => handleRouting("classrooms")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "classrooms" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaChalkboardTeacher className="text-[#1998e1]" /> الكلاسات
            </li>
            <li
              onClick={() => handleRouting("reports")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "reports" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaChartBar className="text-[#1998e1]" /> التقارير
            </li>
            <li
              onClick={() => handleRouting("plans")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "plans" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaClipboardList className="text-[#1998e1]" /> الخطط
            </li>
            <li
              onClick={() => handleRouting("profile")}
              className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ease-in-out duration-300  ${activePage === "profile" ? "bg-[#1998e1]/20" : "hover:bg-[#2c2c2c]"
                }`}
            >
              <FaUser className="text-[#1998e1]" /> الملف الشخصي
            </li>
          </ul>
        </nav>

        <button
          className="flex items-center gap-3 p-2 rounded-lg text-red-500 hover:bg-red-500/10  transition-all ease-in-out duration-300  mt-auto cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt /> تسجيل الخروج
        </button>
      </aside>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 h-screen overflow-y-auto p-4 md:p-8 md:ml-0 hidde_scroll">
        {/* menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 text-[#1998e1] text-2xl cursor-pointer fixed top-3 right-3 z-10 bg-[#111] rounded-xl"
        >
          <FaBars />
        </button>

        {/* المحتوى الديناميكي */}
        {renderContent()}
      </main>
    </div>
  );
}
