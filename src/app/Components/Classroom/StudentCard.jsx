"use client";
import React from "react";
import { FaUser } from "react-icons/fa"; // 🔹 أيقونة المستخدم

export default function StudentCard({ student }) {
    return (
        <div className="bg-[#111] rounded-xl shadow-md p-4 flex items-start gap-4 hover:bg-[#222] transition">
            {/* أيقونة الطالب */}
            <div className="w-12 h-12 rounded-full bg-[#1998e1]/20 flex-shrink-0 flex items-center justify-center text-[#1998e1] text-xl">
                <FaUser />
            </div>

            {/* بيانات الطالب */}
            <div className="flex flex-col gap-1">
                <span className="text-white font-semibold">{student.name}</span>
                <span className="text-gray-400 text-sm">{student.email}</span>
                <span className="text-gray-400 text-sm">{student.phone}</span>

                {/* حالة الطالب ووقت الانضمام */}
                <span
                    className={`text-sm font-medium ${student.isActive ? "text-green-400" : "text-yellow-400"
                        }`}
                >
                    {student.isActive ? "نشط ✅" : "غير نشط ⏳"}
                </span>
                <span className="text-gray-500 text-xs">انضم: {student.joinedAt}</span>
            </div>
        </div>
    );
}
