"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaChalkboardTeacher,
  FaArrowLeft,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

const StudentDetailsPage = () => {
  const { id } = useParams();
  const { setActivePage } = useAppContext();
  const router = useRouter();

  // 🚀 In real project, replace with API call using `id`
  const student = {
    id,
    name: "أحمد محمد",
    email: "student@example.com",
    phone: "01012345678",
    joinedAt: "2025-09-01",
    status: "active", // ✅ active | inactive
    calls: 12, // ✅ number of calls
    classrooms: 5,
  };

  const handleGoBack = () => {
    setActivePage('students');
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-[#090909] text-white py-8 px-4 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold  text-[#1998e1]">
          تفاصيل الطالب
        </h2>
        <button
          onClick={handleGoBack}
          className="bg-[#1998e1]/20 text-[#1998e1] cursor-pointer p-4 rounded-full hover:bg-[#1998e1]/30 transition"
        >
          <FaArrowLeft className="text-[#1998e1] text-md md:text-lg" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-4">
        {/* الكود */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaIdBadge className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">كود الطالب:</span>
          <span className="font-bold text-xs md:text-sm">{student.id}</span>
        </div>

        {/* الاسم */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaUser className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">الاسم:</span>
          <span className="font-bold text-xs md:text-sm">{student.name}</span>
        </div>

        {/* البريد */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaEnvelope className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">البريد الإلكتروني:</span>
          <span className="font-bold text-xs md:text-sm">{student.email}</span>
        </div>

        {/* الهاتف */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaPhone className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">رقم الهاتف:</span>
          <span className="font-bold text-xs md:text-sm">{student.phone}</span>
        </div>

        {/* تاريخ الانضمام */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaCalendarAlt className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">تاريخ الانضمام:</span>
          <span className="font-bold text-xs md:text-sm">{student.joinedAt}</span>
        </div>

        {/* عدد الفصول */}
        <div className="flex items-center gap-2 text-gray-300">
          <FaChalkboardTeacher className="text-[#1998e1] text-md md:text-lg" />
          <span className="text-xs md:text-sm">عدد الفصول:</span>
          <span className="font-bold text-xs md:text-sm">{student.classrooms}</span>
        </div>

        {/* الحالة */}
        <div className="flex items-center gap-2 text-gray-300">
          {student.status === "active" ? (
            <FaCheckCircle className="text-green-500 text-md md:text-lg" />
          ) : (
            <FaTimesCircle className="text-red-500 text-md md:text-lg" />
          )}
          <span className="text-xs md:text-sm">الحالة:</span>
          <span
            className={`font-bold text-xs md:text-sm ${student.status === "active"
              ? "text-green-400"
              : "text-red-400"
              }`}
          >
            {student.status === "active" ? "نشط" : "غير نشط"}
          </span>
        </div>

      </div>
    </div>
  );
};

export default StudentDetailsPage;
