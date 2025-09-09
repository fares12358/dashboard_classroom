"use client";
import React from "react";
import { useParams } from "next/navigation";
import {
  FaIdBadge,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
} from "react-icons/fa";

const page = () => {
  const { id } = useParams(); // هتجيب STU123 من الرابط

  // 🚀 ممكن تجيب من API بدال الـStatic ده
  const student = {
    id,
    name: "أحمد محمد",
    email: "student@example.com",
    phone: "01012345678",
    joinedAt: "2025-09-01",
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#1998e1]">تفاصيل الطالب</h2>

      <div
        className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl 
                   shadow-lg border border-[#2a2a2a] space-y-4"
      >
        {/* الكود */}
        <div className="flex items-center gap-3 text-gray-300">
          <FaIdBadge className="text-[#1998e1] text-lg" />
          <span className="text-sm">كود الطالب:</span>
          <span className="font-bold">{student.id}</span>
        </div>

        {/* الاسم */}
        <div className="flex items-center gap-3 text-gray-300">
          <FaUser className="text-[#1998e1] text-lg" />
          <span className="text-sm">الاسم:</span>
          <span className="font-bold">{student.name}</span>
        </div>

        {/* البريد */}
        <div className="flex items-center gap-3 text-gray-300">
          <FaEnvelope className="text-[#1998e1] text-lg" />
          <span className="text-sm">البريد الإلكتروني:</span>
          <span className="font-bold">{student.email}</span>
        </div>

        {/* الهاتف */}
        <div className="flex items-center gap-3 text-gray-300">
          <FaPhone className="text-[#1998e1] text-lg" />
          <span className="text-sm">رقم الهاتف:</span>
          <span className="font-bold">{student.phone}</span>
        </div>

        {/* تاريخ الانضمام */}
        <div className="flex items-center gap-3 text-gray-300">
          <FaCalendarAlt className="text-[#1998e1] text-lg" />
          <span className="text-sm">تاريخ الانضمام:</span>
          <span className="font-bold">{student.joinedAt}</span>
        </div>
      </div>
    </div>
  );
};

export default page;
