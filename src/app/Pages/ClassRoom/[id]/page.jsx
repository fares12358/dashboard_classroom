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
import NotesTab from "@/app/Components/Classroom/NotesTab";

export default function ClassroomDetailPage() {
  const { id } = useParams();
  const { setActivePage, activeTab, setActiveTab, TapssidebarOpen, setTapsSidebarOpen } = useAppContext();
  const router = useRouter();

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
    { id: "1", name: "أحمد علي", email: "ahmed@gmail.com", phone: "01012345678", isActive: true, joinedAt: "2025-01-15" },
    { id: "2", name: "مريم حسن", email: "mariam@gmail.com", phone: "01098765432", isActive: false, joinedAt: "2025-02-10" },
    { id: "3", name: "علي محمد", email: "ali@gmail.com", phone: "01055555555", isActive: true, joinedAt: "2025-03-05" },
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
        return <NotesTab />;
      default:
        return <HomeTab dummyData={dummyData} onDelete={handleDeleteClass} />;
    }
  };

  const handleRouting = (path) => {
    setTapsSidebarOpen(false);
    setActiveTab(path);
  };

  return (
    <div className="h-screen flex bg-[#090909] text-white" dir="rtl">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 right-0 h-screen w-64 bg-[#111] shadow-lg transform 
          ${TapssidebarOpen ? "translate-x-0" : "translate-x-full"} 
          md:translate-x-0 transition-transform duration-300 z-50 md:pt-10 flex-shrink-0`}
      >
        {/* Mobile header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 md:hidden">
          <h2 className="text-xl font-bold text-[#1998e1]">القائمة</h2>
          <button onClick={() => setTapsSidebarOpen(false)}>
            <FaTimes className="text-[#1998e1]" />
          </button>
        </div>
        {/* classroom name */}
        <div className="text-[#1998e1] text-2xl font-bold text-center mt-5 md:mt-0">{'math class'}</div>

        <nav className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-60px)]">
          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "home" ? "bg-[#1998e1]/20 text-[#1998e1]" : "text-gray-300"}`}
            onClick={() => handleRouting("home")}
          >
            <FaHome className="text-[#1998e1]" />
            الرئيسية
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "students" ? "bg-[#1998e1]/20 text-[#1998e1]" : "text-gray-300"}`}
            onClick={() => handleRouting("students")}
          >
            <FaUsers className="text-[#1998e1]" />
            الطلاب
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "videos" ? "bg-[#1998e1]/20 text-[#1998e1]" : "text-gray-300"}`}
            onClick={() => handleRouting("videos")}
          >
            <FaVideo className="text-[#1998e1]" />
            الفيديوهات
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg cursor-pointer transition-all duration-300 ${activeTab === "files" ? "bg-[#1998e1]/20 text-[#1998e1]" : "text-gray-300"}`}
            onClick={() => handleRouting("files")}
          >
            <FaFilePdf className="text-[#1998e1]" />
            الملفات
          </button>

          <button
            className={`flex items-center gap-3 w-full text-right p-2 rounded-lg transition-all cursor-pointer duration-300 ${activeTab === "notes" ? "bg-[#1998e1]/20 text-[#1998e1]" : "text-gray-300"}`}
            onClick={() => handleRouting("notes")}
          >
            <FaStickyNote className="text-[#1998e1]" />
            الملاحظات
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center md:justify-end justify-between p-4 border-b border-gray-800">
          {/* زر فتح القائمة في الموبايل */}
          <button
            className="md:hidden p-3 text-[#1998e1] text-md bg-[#1998e1]/20 rounded-lg"
            onClick={() => setTapsSidebarOpen(true)}
          >
            <FaBars />
          </button>

          <div className="flex justify-end items-center">
            <button
              onClick={handleGoBack}
              className="bg-[#1998e1]/20 text-[#1998e1] cursor-pointer p-3 rounded-full hover:bg-[#1998e1]/30 transition"
            >
              <FaArrowLeft className="text-[#1998e1] text-md" />
            </button>
          </div>
        </div>

        {/* Tab Content with scroll */}
        <div className="flex-1 overflow-y-auto p-6 md:p-5 hidde_scroll">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
