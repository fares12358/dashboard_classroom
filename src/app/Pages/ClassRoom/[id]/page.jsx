"use client";
import React from "react";
import { useParams } from "next/navigation";
import { FaUsers, FaCalendarAlt, FaChalkboardTeacher } from "react-icons/fa";

export default function ClassroomDetailPage() {
  const { id } = useParams();

  // لاحقًا هتجيب البيانات من API أو DB
  const dummyData = {
    name: "Math Class",
    students: 25,
    createdAt: "2025-09-01",
    teacher: "محمد أحمد",
    description: "كلاس خاص بالرياضيات لطلاب المرحلة الثانوية",
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white p-8" dir="rtl">
      <div className="max-w-3xl mx-auto bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
        {/* عنوان */}
        <h1 className="text-3xl font-bold text-[#1998e1] mb-6">
          {dummyData.name}
        </h1>

        {/* معلومات أساسية */}
        <div className="space-y-4 text-gray-300">
          <p className="text-lg">
            <span className="font-semibold text-white">كود الكلاس:</span> {id}
          </p>

          <p className="flex items-center gap-2">
            <FaChalkboardTeacher className="text-[#1998e1]" />
            <span className="font-semibold text-white">المعلم:</span>{" "}
            {dummyData.teacher}
          </p>

          <p className="flex items-center gap-2">
            <FaUsers className="text-[#1998e1]" />
            <span className="font-semibold text-white">عدد الطلاب:</span>{" "}
            {dummyData.students}
          </p>

          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#1998e1]" />
            <span className="font-semibold text-white">تاريخ الإنشاء:</span>{" "}
            {dummyData.createdAt}
          </p>
        </div>

        {/* وصف */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1998e1] mb-2">
            وصف الكلاس
          </h2>
          <p className="text-gray-400">{dummyData.description}</p>
        </div>
      </div>
    </div>
  );
}
