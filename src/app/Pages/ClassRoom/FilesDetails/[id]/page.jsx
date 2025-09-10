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
  FaCamera,
  FaLock,
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState({
    name: "أحمد محمد",
    username: "admin123",
    email: "admin@example.com",
    phone: "01012345678",
    emailVerified: false,
    avatar: null,
  });

  const [editing, setEditing] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  // Handle profile change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, avatar: URL.createObjectURL(file) });
      toast.success("📷 تم تحديث الصورة الشخصية");
    }
  };

  // Save profile edits
  const handleSave = () => {
    setEditing(false);
    toast.success("✅ تم تحديث البيانات بنجاح");
  };

  // Verify email
  const handleVerifyEmail = () => {
    toast("📧 تم إرسال رابط التحقق إلى بريدك الإلكتروني", { icon: "✉️" });
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      toast.error("⚠️ يرجى ملء جميع الحقول");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      toast.error("❌ كلمة المرور الجديدة غير متطابقة");
      return;
    }
    toast.success("🔑 تم تحديث كلمة المرور");
    setPasswords({ current: "", newPass: "", confirm: "" });
    setPasswordMode(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 w-full">
      <Toaster position="top-center" />

      <div className="bg-gradient-to-br from-[#1c1c1c] to-[#111] rounded-2xl shadow-2xl border border-[#2a2a2a] p-6 sm:p-10">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-8 text-center text-[#1998e1]">
          الملف الشخصي
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <img
              src={
                profile.avatar ||
                `https://ui-avatars.com/api/?name=${profile.name.replace(
                  " ",
                  "+"
                )}&background=1998e1&color=fff`
              }
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-[#1998e1] shadow-md"
            />
            {editing && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition">
                <FaCamera className="text-white text-xl" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {!editing && !passwordMode && (
            <>
              <button
                onClick={() => setEditing(true)}
                className="bg-[#1998e1] text-white px-5 py-2 rounded-lg hover:bg-[#127bb5] transition flex items-center gap-2 shadow-md"
              >
                <FaEdit /> تعديل البيانات
              </button>
              <button
                onClick={() => setPasswordMode(true)}
                className="bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition flex items-center gap-2 shadow-md"
              >
                <FaLock /> تغيير كلمة المرور
              </button>
            </>
          )}
        </div>

        {/* Profile Edit Form */}
        {!passwordMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="bg-[#222] p-4 rounded-xl">
              <label className="flex items-center gap-3 mb-2 text-gray-400 text-sm">
                <FaUser className="text-[#1998e1]" /> الاسم
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
                />
              ) : (
                <p className="text-white text-lg">{profile.name}</p>
              )}
            </div>

            {/* Username */}
            <div className="bg-[#222] p-4 rounded-xl">
              <label className="flex items-center gap-3 mb-2 text-gray-400 text-sm">
                <FaIdBadge className="text-[#1998e1]" /> اسم المستخدم
              </label>
              {editing ? (
                <input
                  type="text"
                  name="username"
                  value={profile.username}
                  onChange={handleChange}
                  className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
                />
              ) : (
                <p className="text-white text-lg">{profile.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="bg-[#222] p-4 rounded-xl sm:col-span-2">
              <label className="flex items-center gap-3 mb-2 text-gray-400 text-sm">
                <FaEnvelope className="text-[#1998e1]" /> البريد الإلكتروني
              </label>
              {editing ? (
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-white text-lg break-words">{profile.email}</p>
                  {profile.emailVerified ? (
                    <span className="flex items-center gap-2 text-green-400 text-sm">
                      <FaCheckCircle /> تم التحقق
                    </span>
                  ) : (
                    <button
                      onClick={handleVerifyEmail}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
                    >
                      <FaTimesCircle /> تحقق من البريد
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="bg-[#222] p-4 rounded-xl sm:col-span-2">
              <label className="flex items-center gap-3 mb-2 text-gray-400 text-sm">
                <FaPhone className="text-[#1998e1]" /> الهاتف
              </label>
              {editing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
                />
              ) : (
                <p className="text-white text-lg">{profile.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Change Password Form */}
        {passwordMode && (
          <div className="bg-[#222] p-6 rounded-xl space-y-4">
            <h3 className="text-xl text-white font-semibold mb-4 flex items-center gap-2">
              <FaLock className="text-[#1998e1]" /> تغيير كلمة المرور
            </h3>
            <input
              type="password"
              placeholder="كلمة المرور الحالية"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
            />
            <input
              type="password"
              placeholder="كلمة المرور الجديدة"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
            />
            <input
              type="password"
              placeholder="تأكيد كلمة المرور"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              className="w-full bg-[#111] p-3 rounded-lg text-white outline-none border border-[#333] focus:border-[#1998e1]"
            />
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={handlePasswordChange}
                className="flex items-center gap-2 bg-[#1998e1] text-white px-5 py-2 rounded-lg hover:bg-[#127bb5] transition"
              >
                <FaSave /> حفظ
              </button>
              <button
                onClick={() => setPasswordMode(false)}
                className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                <FaUndo /> إلغاء
              </button>
            </div>
          </div>
        )}

        {/* Save / Cancel Buttons for Profile Edit */}
        {editing && !passwordMode && (
          <div className="flex gap-4 mt-8 justify-end">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#1998e1] text-white px-5 py-2 rounded-lg hover:bg-[#127bb5] transition"
            >
              <FaSave /> حفظ
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-2 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-500 transition"
            >
              <FaUndo /> إلغاء
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
