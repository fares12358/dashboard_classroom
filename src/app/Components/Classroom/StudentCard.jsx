"use client";
import React from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
  FaHourglassHalf,
  FaCalendarAlt,
} from "react-icons/fa";

export default function StudentCard({ student }) {
  return (
    <div className="bg-[#111] rounded-xl shadow-md p-4 flex flex-col md:flex-row items-start gap-4 hover:bg-[#222] transition">
      {/* أيقونة الطالب */}
      <div className="w-12 h-12 rounded-full bg-[#1998e1]/20 flex-shrink-0 flex items-center justify-center text-[#1998e1] text-xl">
        <FaUser />
      </div>

      {/* بيانات الطالب */}
      <div className="flex flex-col gap-1">
        <span className="text-white font-semibold flex items-center gap-2">
          <FaUser className="text-[#1998e1]" /> {student.name}
        </span>

        <span className="text-gray-400 text-sm flex items-center gap-2">
          <FaEnvelope className="text-[#1998e1]" /> {student.email}
        </span>

        <span className="text-gray-400 text-sm flex items-center gap-2">
          <FaPhone className="text-[#1998e1]" /> {student.phone}
        </span>

        {/* حالة الطالب */}
        <span
          className={`text-sm font-medium flex items-center gap-2 ${student.status == "active" ? "text-green-400" : "text-yellow-400"
            }`}
        >
          {student.status == "active" ? (
            <>
              <FaCheckCircle /> نشط
            </>
          ) : (
            <>
              <FaHourglassHalf /> غير نشط
            </>
          )}
        </span>

        {/* تاريخ الانضمام */}
        <span className="text-gray-500 text-xs flex items-center gap-2">
          <FaCalendarAlt className="text-[#1998e1]" /> انضم: {new Date(student.createdAt).toLocaleDateString("ar-EG", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
