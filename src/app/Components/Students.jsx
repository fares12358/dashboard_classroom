"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaSpinner,
} from "react-icons/fa";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../utils/api";

const Students = () => {
  const router = useRouter();
  const { students, setStudents } = useAppContext();
  const [loading, setLoading] = useState(false);

  // ✅ Fetch students
  useEffect(() => {
    if(students !== null) return;
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/students`);
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("فشل في تحميل الطلاب");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [setStudents]);

  return (
    <div>
      <Toaster />
      <h2 className="text-2xl font-bold mb-6 mr-10 md:mr-0">الطلاب</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-[#1998e1] text-4xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students?.map((student) => (
            <div
              key={student.id}
              onClick={() =>
                router.push(`/Pages/StudentDetails/${student.id}`)
              }
              className="relative bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg cursor-pointer 
                         hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a]"
            >
              {/* اسم الطالب */}
              <h3 className="text-xl font-bold text-[#1998e1] mb-4 flex items-center gap-2">
                <FaUser className="text-[#1998e1]" />
                {student.name}
              </h3>

              {/* حالة التفعيل */}
              <div className="flex items-center gap-2 text-sm mb-3">
                {student.status === "active" ? (
                  <FaCheckCircle className="text-green-400" />
                ) : (
                  <FaTimesCircle className="text-red-400" />
                )}
                <span
                  className={
                    student.status === "active"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {student.status === "active" ? "نشط" : "غير نشط"}
                </span>
              </div>

              {/* تاريخ الإنشاء */}
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <FaCalendarAlt className="text-[#1998e1]" />
                {new Date(student.createdAt).toLocaleDateString("ar-EG")}
              </div>

              {/* عدد الكلاسات */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <FaChalkboardTeacher className="text-[#1998e1]" />
                {student.classes?.length || 0} كلاس
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Students;
