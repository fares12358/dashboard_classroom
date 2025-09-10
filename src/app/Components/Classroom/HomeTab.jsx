"use client";
import React, { useState } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function HomeTab({ dummyData, onDelete }) {
  const [className, setClassName] = useState(dummyData.name);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState("نشط"); // 🔹 Active / Pending

  const handleSave = () => {
    setIsEditing(false);
    toast.success("تم تعديل بيانات الكلاس بنجاح ✅");
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 relative">
      {/* زر الحذف أعلى الكارد */}
      <button
        onClick={onDelete}
        className="absolute top-4 left-4 text-red-500 hover:text-red-600 bg-red-600/20 p-3 rounded-full transition cursor-pointer"
      >
        <FaTrash className="text-md" />
      </button>

      {/* زر التعديل */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 text-[#1998e1] hover:text-blue-400 bg-[#1998e1]/20 p-3 rounded-full transition cursor-pointer"
      >
        <FaEdit className="text-md" />
      </button>

      {/* محتوى الكارد */}
      {isEditing ? (
        <div className="flex flex-col gap-4 mb-6 mt-10">
          {/* تعديل الاسم */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">اسم الكلاس</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 text-white focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
            />
          </div>

          {/* تعديل الحالة */}
          <div>
            <label className="text-sm text-gray-400 block mb-2">حالة الكلاس</label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 pr-10 rounded-lg bg-[#111] border border-gray-700 text-white appearance-none focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
              >
                <option value="نشط">✅ نشط</option>
                <option value="معلق">⏳ معلق</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1998e1]">
                {status === "نشط" ? <FaCheckCircle /> : <FaClock />}
              </span>
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600/20 text-green-500 p-3 rounded-lg hover:bg-green-600/30 transition cursor-pointer"
            >
              حفظ
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-gray-600/20 text-gray-300 p-3 rounded-lg hover:bg-gray-600/30 transition cursor-pointer"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* عرض الاسم والحالة */}
          <h1 className="text-3xl font-bold text-[#1998e1] mb-2 mt-10">{className}</h1>
          <p
            className={`flex items-center gap-2 text-sm mb-6 ${status === "نشط" ? "text-green-400" : "text-yellow-400"
              }`}
          >
            {status === "نشط" ? (
              <>
                <FaCheckCircle /> الكلاس نشط
              </>
            ) : (
              <>
                <FaClock /> الكلاس معلق
              </>
            )}
          </p>
        </>
      )}

      {/* باقي تفاصيل الكلاس */}
      <div className="space-y-4 text-gray-300">

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

      <div className="mt-6">
        <h2 className="text-xl font-semibold text-[#1998e1] mb-2">
          وصف الكلاس
        </h2>
        <p className="text-gray-400">{dummyData.description}</p>
      </div>
    </div>
  );
}
