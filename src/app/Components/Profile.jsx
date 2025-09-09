"use client";
import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaSave,
  FaUndo,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "أحمد محمد",
    username: "admin123",
    email: "admin@example.com",
    phone: "01012345678",
    emailVerified: false,
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    toast.success("✅ تم تحديث البيانات بنجاح");
  };

  const handleVerifyEmail = () => {
    toast("📧 تم إرسال رابط التحقق إلى بريدك الإلكتروني", { icon: "✉️" });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-right">
        الملف الشخصي
      </h2>

      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-6">
        {/* الاسم */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] shrink-0">
            <FaUser />
          </div>
          {editing ? (
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="bg-transparent border-b border-[#1998e1] text-white outline-none flex-1 text-base sm:text-lg w-full"
            />
          ) : (
            <p className="text-base sm:text-lg text-white break-words">{profile.name}</p>
          )}
        </div>

        {/* اسم المستخدم */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] shrink-0">
            <FaIdBadge />
          </div>
          {editing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="bg-transparent border-b border-[#1998e1] text-white outline-none flex-1 text-base sm:text-lg w-full"
            />
          ) : (
            <p className="text-base sm:text-lg text-white break-words">{profile.username}</p>
          )}
        </div>

        {/* البريد الإلكتروني */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] shrink-0">
            <FaEnvelope />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <p className="text-base sm:text-lg text-white break-words flex-1">{profile.email}</p>
            {profile.emailVerified ? (
              <FaCheckCircle
                className="text-green-400 text-xl"
                title="تم التحقق"
              />
            ) : (
              <button
                onClick={handleVerifyEmail}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm sm:text-base"
              >
                <FaTimesCircle /> تحقق من البريد
              </button>
            )}
          </div>
        </div>

        {/* الهاتف */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] shrink-0">
            <FaPhone />
          </div>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="bg-transparent border-b border-[#1998e1] text-white outline-none flex-1 text-base sm:text-lg w-full"
            />
          ) : (
            <p className="text-base sm:text-lg text-white break-words">{profile.phone}</p>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-[#2a2a2a]">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bb5] transition w-full sm:w-auto"
              >
                <FaSave /> حفظ
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition w-full sm:w-auto"
              >
                <FaUndo /> إلغاء
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bb5] transition w-full sm:w-auto"
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
