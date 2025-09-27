"use client";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import ClassroomCard from "./ClassroomCard";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import { API_URL } from "../utils/api";
import toast from "react-hot-toast";

const DashboardHome = () => {
  const { user, classrooms, setClassrooms, homeReport, setHomeReport } = useAppContext();
  const [loading, setLoading] = useState(false);

  
  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      // ✅ 1) تحديث الكلاسات
      const resClasses = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClassrooms(resClasses.data);

      // ✅ 2) تحديث التقارير
      const resReports = await axios.get(`${API_URL}/admin/homeReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomeReport(resReports.data);

      toast.success("تم تحديث البيانات والتقارير");
    } catch (err) {
      console.error("Error refreshing dashboard:", err);
      toast.error("فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Get home reports
  const handleGetreport = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_URL}/admin/homeReport`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHomeReport(res.data);
      toast.success("تم تحديث التقارير");
    } catch (err) {
      console.error("Error refreshing reports:", err);
      toast.error("فشل تحديث التقارير");
    }
  };

  useEffect(() => {
    if (!homeReport) handleGetreport();
  }, []);

  return (
    <div>
      {/* الشريط العلوي */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 mr-10 md:mr-0">
        <h2 className="text-2xl font-semibold self-start">
          مرحباً بعودتك 👋 {user?.name}
        </h2>

        {/* ✅ Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaIcons.FaSpinner className="animate-spin" /> : <FaIcons.FaSync />}
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {/* إحصائيات لوحة التحكم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {homeReport?.reports?.map((report, idx) => {
          const Icon = FaIcons[report.icon] || FaIcons.FaUsers; // fallback icon
          return (
            <div
              key={idx}
              className="bg-[#1a1a1a] p-6 rounded-xl shadow-md flex items-center gap-4"
            >
              <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl">
                <Icon />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#1998e1]">{report.title}</h3>
                <p className="text-2xl font-bold mt-2">{report.value}</p>
                <p className="text-sm text-gray-400">{report.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* قائمة الكلاسات */}
      <h2 className="text-xl font-semibold mb-4">الفصول الدراسية</h2>
      {!classrooms || classrooms.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          لا توجد فصول دراسية متاحة حالياً
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classrooms.map((classroom) => (
            <ClassroomCard key={classroom.id} {...classroom} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
