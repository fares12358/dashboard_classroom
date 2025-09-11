"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaFilePdf,
  FaEdit,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaUpload,
  FaTimes,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

export default function FileDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setActiveTab } = useAppContext();

  // Mock Data
  const [fileData, setFileData] = useState({
    id,
    name: "ملف تجريبي",
    description: "هذا وصف الملف.",
    url: "/files/sample.pdf",
    date: "2025-09-10",
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(0);
  const [tempData, setTempData] = useState(fileData); // تخزين بيانات مؤقتة عند التعديل

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف الملف؟")) {
      console.log("Deleted:", fileData.id);
      router.push("/Pages/ClassRoom");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(0);
      const interval = setInterval(() => {
        setLoading((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      setTempData({ ...tempData, url: URL.createObjectURL(file) });
    }
  };

  const handleSave = () => {
    setFileData(tempData); // حفظ التعديلات
    console.log("Updated File:", tempData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setTempData(fileData); // استرجاع البيانات الأصلية
    setEditMode(false);
  };

  const handleGoBack = () => {
    setActiveTab("FilesTab");
    router.back();
  };

  return (
    <div className="p-6 bg-[#1a1a1a] min-h-screen flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-3xl flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaFilePdf className="text-red-500" /> {fileData.name}
        </h1>
        <button
          onClick={handleGoBack}
          className="bg-[#1998e1]/20 text-[#1998e1] p-3 rounded-full hover:bg-[#1998e1]/30 transition cursor-pointer"
        >
          <FaArrowLeft />
        </button>
      </div>

      {/* File Preview */}
      <div className="w-full max-w-3xl bg-[#222] rounded-lg shadow-md p-4 mb-6">
        <iframe
          src={editMode ? tempData.url : fileData.url}
          className="w-full h-[400px] rounded-lg"
          title="File Preview"
        />
      </div>

      {/* File Info */}
      <div className="w-full max-w-3xl flex flex-col gap-3">
        {editMode ? (
          <>
            {/* اسم الملف */}
            <input
              type="text"
              value={tempData.name}
              onChange={(e) =>
                setTempData({ ...tempData, name: e.target.value })
              }
              className="p-2 rounded-md bg-[#111] text-white outline-none"
              placeholder="اسم الملف"
            />

            {/* وصف الملف */}
            <input
              type="text"
              value={tempData.description}
              onChange={(e) =>
                setTempData({ ...tempData, description: e.target.value })
              }
              className="p-2 rounded-md bg-[#111] text-white outline-none"
              placeholder="وصف الملف"
            />

            {/* رفع ملف جديد */}
            <div className="flex items-center gap-3">
              <FaFilePdf className="text-red-500 text-xl" />
              <label className="flex items-center gap-2 cursor-pointer bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition">
                <FaUpload /> اختر ملف PDF
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* شريط التقدم */}
            {loading > 0 && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-[#1998e1] h-2 rounded-full transition-all"
                  style={{ width: `${loading}%` }}
                ></div>
              </div>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-300">{fileData.description}</p>
            <span className="text-gray-400 text-sm">
              تمت الإضافة: {fileData.date}
            </span>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="w-full max-w-3xl flex gap-4 mt-6">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              <FaSave /> حفظ
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <FaTimes /> إلغاء
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bbf] transition cursor-pointer"
            >
              <FaEdit /> تعديل
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              <FaTrash /> حذف
            </button>
          </>
        )}

      </div>
    </div>
  );
}
