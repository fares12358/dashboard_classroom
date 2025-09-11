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
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEditing(false);
    setPasswords({ currentPassword: "", newPassword: "" });
    toast.success(" تم تحديث البيانات بنجاح");
  };

  const handleVerifyEmail = () => {
    toast(" تم إرسال رابط التحقق إلى بريدك الإلكتروني", { icon: "✉️" });
  };

  return (
    <div className="px-0 sm:px-6 lg:px-8 w-full">
      <Toaster position="top-center" reverseOrder={false} />

      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-right">
        الملف الشخصي
      </h2>

      <div className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 sm:p-8 rounded-2xl shadow-lg border border-[#2a2a2a] space-y-8">
        {/* القسم الأول: البيانات الشخصية */}
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
                value={profile.name}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
              />
            ) : (
              <p className="text-white">{profile.name}</p>
            )}
          </div>

          {/* اسم المستخدم */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaIdBadge /> اسم المستخدم
            </label>
            {editing ? (
              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
              />
            ) : (
              <p className="text-white">{profile.username}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaEnvelope /> البريد الإلكتروني
            </label>
            <div className="flex items-start gap-3 flex-col">
              <p className="text-white">{profile.email}</p>
              {profile.emailVerified ? (
                <span className='flex items-center justify-center gap-1 text-green-400'>
                  <FaCheckCircle className="text-green-400 text-lg" title="تم التحقق" /> تم التحقق
                </span>
              ) : (
                <button
                  onClick={handleVerifyEmail}
                  className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm cursor-pointer"
                >
                  <FaTimesCircle /> تحقق
                </button>
              )}
            </div>
          </div>

          {/* الهاتف */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-[#1998e1] flex items-center gap-2">
              <FaPhone /> الهاتف
            </label>
            {editing ? (
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
              />
            ) : (
              <p className="text-white">{profile.phone}</p>
            )}
          </div>
        </div>

        {/* القسم الثاني: كلمة المرور */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4 border-b border-[#2a2a2a] pb-2">
            الأمان
          </h3>

          {editing ? (
            <>
              {/* كلمة المرور الحالية */}
              <div className="flex flex-col gap-2 mb-4">
                <label className="text-sm text-[#1998e1] flex items-center gap-2">
                  <FaLock /> كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwords.currentPassword}
                  onChange={handlePasswordChange}
                  className="bg-transparent border-b border-[#1998e1] text-white outline-none px-2 py-1"
                />
              </div>

              {/* كلمة المرور الجديدة */}
              <div className="flex flex-col gap-2">
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
            </>
          ) : (
            <p className="text-[#1998e1] text-sm">
              ******** (مخفي) - لتغيير كلمة المرور اضغط تعديل
            </p>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#2a2a2a]">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-[#127bb5] transition w-full sm:w-auto cursor-pointer"
              >
                <FaSave /> حفظ
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
