"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaTrash,
  FaEdit,
  FaCheckCircle,
  FaClock,
  FaSync,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/utils/api";


export default function HomeTab({ classID }) {
  const router = useRouter();
  const { classData, setClassData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("pending");
  const [description, setDescription] = useState("");

  // ✅ Fetch class data
  const fetchClass = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}`);
      setClassData(res.data);
      setClassName(res.data.name);
      setStatus(res.data.status);
      setDescription(res.data.description);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل بيانات الكلاس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (classData) return;
    fetchClass();
  }, [classID]);

  // ✅ Update class
  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/admin/classe/${classID}`, {
        name: className,
        description,
        status,
      });

      toast.success("تم تعديل بيانات الكلاس بنجاح ✅");
      setIsEditing(false);
      await fetchClass();
    } catch (err) {
      console.error(err);
      toast.error("فشل تعديل الكلاس");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete class
  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/classe/${classID}`);
      toast.success("تم حذف الكلاس بنجاح 🗑️");
      setShowDeleteModal(false);
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف الكلاس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ✅ Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-50 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1998e1] border-t-transparent"></div>
        </div>
      )}

      <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 relative">
        {/* زر الحذف */}
        <button
          onClick={() => setShowDeleteModal(true)}
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

        {/* زر تحديث البيانات */}
        <button
          onClick={fetchClass}
          className="absolute top-4 right-16 text-green-500 hover:text-green-400 bg-green-600/20 p-3 rounded-full transition cursor-pointer"
        >
          <FaSync className={`text-md ${loading ? "animate-spin" : ""}`} />
        </button>

        {/* المحتوى */}
        {isEditing ? (
          <div className="flex flex-col gap-4 mb-6 mt-10">
            {/* تعديل الاسم */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                اسم الكلاس
              </label>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 text-white focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
              />
            </div>

            {/* تعديل الحالة */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">
                حالة الكلاس
              </label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 pr-10 rounded-lg bg-[#111] border border-gray-700 text-white appearance-none focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
                >
                  <option value="active">✅ نشط</option>
                  <option value="pending">⏳ معلق</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1998e1]">
                  {status === "active" ? <FaCheckCircle /> : <FaClock />}
                </span>
              </div>
            </div>

            {/* تعديل الوصف */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">الوصف</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#111] border border-gray-700 text-white focus:border-[#1998e1] focus:ring-1 focus:ring-[#1998e1] outline-none"
              />
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
            <h1 className="text-3xl font-bold text-[#1998e1] mb-2 mt-10">
              {classData?.name}
            </h1>
            <p
              className={`flex items-center gap-2 text-sm mb-6 ${
                classData?.status === "active"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {classData?.status === "active" ? (
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
            {classData?.studentsCount || 0}
          </p>

          <p className="flex items-center gap-2">
            <FaCalendarAlt className="text-[#1998e1]" />
            <span className="font-semibold text-white">تاريخ الإنشاء:</span>{" "}
            {new Date(classData?.createdAt).toLocaleDateString("ar-EG")}
          </p>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-[#1998e1] mb-2">
            وصف الكلاس
          </h2>
          <p className="text-gray-400">
            {classData?.description || "لا يوجد وصف"}
          </p>
        </div>
      </div>

      {/* ✅ Modal للتأكيد قبل الحذف */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg w-96 text-center">
            <h2 className="text-xl text-white font-bold mb-4">
              هل أنت متأكد من الحذف؟
            </h2>
            <p className="text-gray-400 mb-6">
              سيتم حذف الكلاس بشكل نهائي ولا يمكن التراجع عن العملية.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onDelete}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
              >
                <FaTrash /> حذف
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white flex items-center gap-2 cursor-pointer"
              >
                <FaTimes /> إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
