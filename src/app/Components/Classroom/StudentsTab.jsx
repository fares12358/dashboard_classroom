"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import StudentCard from "./StudentCard";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { FaSyncAlt } from "react-icons/fa";

export default function StudentsTab({ classID }) {
  const { studentsClass, setStudentsClass ,classid,setClassid} = useAppContext();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ جلب الطلاب
  const fetchStudents = async () => {
    if (!classID) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/student`);
      if (res.data.success) {
        setStudentsClass(res.data.students);
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

  // ✅ تحديث يدوي (Refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
  };

  useEffect(() => {
    if (!classID) return;
    if (studentsClass) return;
    fetchStudents();
  }, [classID]);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-4">
      <Toaster position="top-center" reverseOrder={false} />

      {/* العنوان + زر التحديث */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentsClass?.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">📌 لا يوجد طلاب حتى الآن.</p>
      )}
    </div>
  );
}
