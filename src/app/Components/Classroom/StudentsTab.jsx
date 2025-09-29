"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import StudentCard from "./StudentCard";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { FaSyncAlt } from "react-icons/fa";


export default function StudentsTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const token = localStorage.getItem("adminToken");
  // 🔹 Ensure class slot exists in context
  useEffect(() => {
    if (classID) openClass(classID);
  }, [classID]);

  // 🔹 Get students from context
  const studentsClass = getClassData(classID)?.students;

  // ✅ Fetch students
  const fetchStudents = async (force = false) => {
    if (!classID) return;

    if (studentsClass && !force) return; // use cached data

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/student`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClassTabData(classID, "students", res.data.students);
        console.log(res.data.students);

        toast.success("✅ تم جلب الطلاب بنجاح");
      } else {
        toast.error(res.data.message || "فشل في جلب الطلاب ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء جلب الطلاب ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents(true); // force fetch
    setRefreshing(false);
  };

  // 🔹 Initial fetch
  useEffect(() => {
    if (!classID) return;
    fetchStudents();
  }, [classID]);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header + Refresh button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#1998e1]">الطلاب</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-4 py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
        >
          {refreshing ? (
            <span className="animate-spin">
              <FaSyncAlt />
            </span>
          ) : (
            <FaSyncAlt />
          )}
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {loading ? (
        <p className="text-gray-300 animate-pulse">⏳ جاري التحميل...</p>
      ) : studentsClass?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {studentsClass.map((student) => (
            <StudentCard key={student._id} classID={classID} student={student} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">📌 لا يوجد طلاب حتى الآن.</p>
      )}
    </div>
  );
}
