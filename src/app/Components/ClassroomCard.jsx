"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCopy, FaUsers, FaCalendarAlt, FaIdBadge } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

export default function ClassroomCard({ name, id, students, createdAt }) {
  const router = useRouter();

  // نسخ الـ ID
  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success(" تم نسخ الكود");
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div
        onClick={() => router.push(`/Pages/ClassRoom/${id}`)}
        className="relative bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg cursor-pointer 
                 hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a]"
      >
        {/* زر نسخ في الأعلى يسار */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCopy();
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-[#1998e1]/10 text-[#1998e1] 
                     hover:bg-[#1998e1] hover:text-white transition cursor-pointer"
          title="نسخ الكود"
        >
          <FaCopy />
        </button>

        {/* اسم الكلاس */}
        <h3 className="text-xl font-bold text-[#1998e1] mb-4">{name}</h3>

        {/* ID */}
        <div className="flex items-center justify-start mb-4 text-gray-300 text-sm gap-2">
          <FaIdBadge className="text-[#1998e1]" />
          {id}
        </div>

        {/* عدد الطلاب */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <FaUsers className="text-[#1998e1]" /> {students} طالب
        </div>

        {/* تاريخ الإنشاء */}
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <FaCalendarAlt className="text-[#1998e1]" /> {createdAt}
        </div>
      </div>
    </>
  );
}
