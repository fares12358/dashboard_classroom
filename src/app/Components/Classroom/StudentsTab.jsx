"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import StudentCard from "./StudentCard";
import { API_URL } from "@/app/utils/api";


export default function StudentsTab({ classID }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!classID) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/classe/${classID}/student`);
        if (res.data.success) {
          setStudents(res.data.students);
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

    fetchStudents();
  }, [classID]);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-4">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-2xl font-bold text-[#1998e1] mb-4">الطلاب</h2>

      {loading ? (
        <p className="text-gray-300 animate-pulse">⏳ جاري التحميل...</p>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <StudentCard key={student._id} student={student} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">📌 لا يوجد طلاب حتى الآن.</p>
      )}
    </div>
  );
}
