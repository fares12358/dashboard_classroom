"use client";
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaEdit,
  FaSave,
  FaUndo,
  FaLock,
  FaSpinner,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api";
import { useAppContext } from "../Context/AppContext";

const Profile = () => {
  const { user, setUser } = useAppContext(); // بيانات الأدمن من الكونتكست
  const [loading, setLoading] = useState(!user); // لو مفيش بيانات نعمل لود
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
  });
  const [editing, setEditing] = useState(false);
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ حفظ التحديث
  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updateData = {
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
      };

      if (passwords.newPassword) {
        updateData.password = passwords.newPassword;
      }
      const res = await axios.put(`http://localhost:5000/api/admin/auth/${user._id}`, updateData);
      // ✅ إعادة التحديث في الكونتكست فقط (من غير ما نعمل ريكويست تاني)
      setUser(res.data.newadmin);
      toast.success("تم تحديث البيانات بنجاح ✅");
      setEditing(false);
      setPasswords({ newPassword: "" });
    } catch (err) {
      toast.error("فشل التحديث ❌");
    } finally {
      setSaving(false);
    }
  };

  // ✅ شاشة التحميل مع أنيميشن
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-[#1998e1] text-4xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center text-red-500 mt-10">
        لا توجد بيانات لعرضها ❌
      </div>
    );
  }

  return (
    <div className="px-0 sm:px-6 lg:px-8 w-full animate-fadeIn">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-right">
        الملف الشخصي
      </h2>

      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-8 transition-all duration-300">
        {/* البيانات الشخصية */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-[#2a2a2a] pb-2">
            البيانات الشخصية
          </h3>

          {/* الاسم */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaUser /> الاسم
            </label>
            {editing ? (
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1 transition-all"
              />
            ) : (
              <p className="text-white">{user.name}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaEnvelope /> البريد الإلكتروني
            </label>
            <p className="text-white">{user.email}</p>
          </div>

          {/* الهاتف */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaPhone /> الهاتف
            </label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={user.phone || ""}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
              />
            ) : (
              <p className="text-white">{user.phone}</p>
            )}
          </div>

          {/* الدور */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaIdBadge /> الدور
            </label>
            {editing ? (
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="bg-[#222] text-white rounded px-2 py-1"
              >
                <option value="admin">مدير</option>
                <option value="super-admin">سوبر مدير</option>
              </select>
            ) : (
              <p className="text-white">{user.role}</p>
            )}
          </div>

          {/* الحالة */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              الحالة
            </label>
            {editing ? (
              <select
                name="status"
                value={user.status}
                onChange={handleChange}
                className="bg-[#222] text-white rounded px-2 py-1"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
              </select>
            ) : (
              <p
                className={`${user.status === "active" ? "text-green-400" : "text-red-400"}`}
              >
                {user.status === "active" ? "نشط" : "غير نشط"}
              </p>
            )}
          </div>
        </div>

        {/* كلمة المرور */}
        {editing && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-[#2a2a2a] pb-2">
              الأمان
            </h3>
            <div className="flex flex-col gap-2 mb-4">
              <label className="text-sm text-[#1998e1] flex items-center gap-2">
                <FaLock /> كلمة المرور الجديدة
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
              />
            </div>
          </div>
        )}

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2a2a2a]">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition w-full sm:w-auto cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FaSave /> حفظ
                  </>
                )}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full sm:w-auto cursor-pointer"
              >
                <FaUndo /> إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bb5] transition w-full sm:w-auto cursor-pointer"
            >
              <FaEdit /> تعديل البيانات
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
