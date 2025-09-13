"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaChalkboardTeacher,
} from "react-icons/fa";

const Students = () => {
  const router = useRouter();

  // Example students data
  const students = [
    {
      id: "STU123",
      name: "أحمد محمد",
      active: true,
      renewDate: "2025-10-01",
      classes: 3,
    },
    {
      id: "STU456",
      name: "سارة علي",
      active: false,
      renewDate: "2025-09-20",
      classes: 1,
    },
    {
      id: "STU789",
      name: "محمود حسن",
      active: true,
      renewDate: "2025-11-15",
      classes: 5,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6  mr-10 md:mr-0 ">الطلاب</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => router.push(`/Pages/StudentDetails/${student.id}`)}
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
              {student.active ? (
                <FaCheckCircle className="text-green-400" />
              ) : (
                <FaTimesCircle className="text-red-400" />
              )}
              <span
                className={student.active ? "text-green-400" : "text-red-400"}
              >
                {student.active ? "نشط" : "غير نشط"}
              </span>
            </div>

            {/* تاريخ التجديد */}
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
              <FaCalendarAlt className="text-[#1998e1]" />
              {student.renewDate}
            </div>

            {/* عدد الكلاسات */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <FaChalkboardTeacher className="text-[#1998e1]" />
              {student.classes} كلاس
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Students;
