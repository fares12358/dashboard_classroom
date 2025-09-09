"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaUsers,
  FaBars,
  FaTimes,
  FaHome,
  FaVideo,
  FaFilePdf,
  FaArrowLeft,
  FaStickyNote,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

// Components
import HomeTab from "@/app/Components/Classroom/HomeTab";
import StudentsTab from "@/app/Components/Classroom/StudentsTab";
import VideosTab from "@/app/Components/Classroom/VideosTab";
import FilesTab from "@/app/Components/Classroom/FilesTab";
import NotesTab from "@/app/Components/Classroom/NotesTab"; // ✅ جديد

export default function ClassroomDetailPage() {
  const { id } = useParams();
  const { setActivePage } = useAppContext();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  // بيانات تجريبية
  const dummyData = {
    name: "Math Class",
    students: 25,
    createdAt: "2025-09-01",
    teacher: "محمد أحمد",
    description: "كلاس خاص بالرياضيات لطلاب المرحلة الثانوية",
  };

  const handleGoBack = () => {
    setActivePage("classrooms");
    router.push("/");
  };

  const handleDeleteClass = () => {
    if (confirm("هل أنت متأكد من حذف هذا الكلاس؟")) {
      alert("تم حذف الكلاس بنجاح");
      router.push("/");
    }
  };

  // بيانات تجريبية للطلاب
  const studentsData = [
    { name: "أحمد علي", email: "ahmed@gmail.com", phone: "01012345678", isActive: true, joinedAt: "2025-01-15" },
    { name: "مريم حسن", email: "mariam@gmail.com", phone: "01098765432", isActive: false, joinedAt: "2025-02-10" },
    { name: "علي محمد", email: "ali@gmail.com", phone: "01055555555", isActive: true, joinedAt: "2025-03-05" },
  ];

  // 🔹 Function to render tab component
  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeTab dummyData={dummyData} onDelete={handleDeleteClass} />;
      case "students":
        return <StudentsTab students={studentsData} />;
      case "videos":
        return <VideosTab />;
      case "files":
        return <FilesTab />;
      case "notes":
        return <NotesTab />; // ✅ جديد
      default:
        return <HomeTab dummyData={dummyData} onDelete={handleDeleteClass} />;
    }
  };

  const handleRouting = (path) => {
    setSidebarOpen(false);
    setActiveTab(path);
  };

  return (
    <div className="min-h-screen flex bg-[#090909] text-white" dir="rtl">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 right-0 h-[100dvh] w-64 bg-[#111] shadow-lg transform 
          ${sidebarOpen ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 z-50 md:pt-10`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700 md:hidden">
          <h2 className="text-xl font-bold text-[#1998e1]">القائمة</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <FaTimes className="text-[#1998e1]" />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg ${activeTab === "home"
              ? "bg-[#1998e1]/20 text-[#1998e1]"
              : "text-gray-300"
              }`}
            onClick={() => handleRouting("home")}
          >
            <FaHome className="text-[#1998e1]" /> {/* ✅ الأيقونة ثابتة */}
            الرئيسية
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg ${activeTab === "students"
              ? "bg-[#1998e1]/20 text-[#1998e1]"
              : "text-gray-300"
              }`}
            onClick={() => handleRouting("students")}
          >
            <FaUsers className="text-[#1998e1]" /> {/* ✅ الأيقونة ثابتة */}
            الطلاب
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg ${activeTab === "videos"
              ? "bg-[#1998e1]/20 text-[#1998e1]"
              : "text-gray-300"
              }`}
            onClick={() => handleRouting("videos")}
          >
            <FaVideo className="text-[#1998e1]" /> {/* ✅ الأيقونة ثابتة */}
            الفيديوهات
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg ${activeTab === "files"
              ? "bg-[#1998e1]/20 text-[#1998e1]"
              : "text-gray-300"
              }`}
            onClick={() => handleRouting("files")}
          >
            <FaFilePdf className="text-[#1998e1]" /> {/* ✅ الأيقونة ثابتة */}
            الملفات
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg ${activeTab === "notes"
              ? "bg-[#1998e1]/20 text-[#1998e1]"
              : "text-gray-300"
              }`}
            onClick={() => handleRouting("notes")}
          >
            <FaStickyNote className="text-[#1998e1]" /> {/* ✅ الأيقونة ثابتة */}
            الملاحظات
          </button>
        </nav>

      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-5">
        <div className="flex items-center md:justify-end justify-between mb-5">
          {/* زر فتح القائمة في الموبايل */}
          <button
            className="md:hidden p-3 text-[#1998e1] text-md bg-[#1998e1]/20 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>

          {/* Header */}
          <div className="flex justify-end items-center">
            <button
              onClick={handleGoBack}
              className="bg-[#1998e1]/20 text-[#1998e1] cursor-pointer p-3 rounded-full hover:bg-[#1998e1]/30 transition"
            >
              <FaArrowLeft className="text-[#1998e1] text-md" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}
