'use client'
import React, { useState } from "react";
import { useParams } from "next/navigation";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {
  const { token } = useParams(); // 👈 التوكن من الرابط
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5" dir="rtl">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          أدخل كلمة المرور الجديدة لحسابك.
        </p>

        {/* كلمة المرور الجديدة */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">كلمة المرور الجديدة</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أدخل كلمة المرور الجديدة"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="absolute left-3 top-3 text-[#1998e1] focus:outline-none cursor-pointer"
            >
              {passwordVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* تأكيد كلمة المرور */}
        <div className="mb-6">
          <label className="block text-gray-300 mb-2">تأكيد كلمة المرور</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={confirmVisible ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أعد إدخال كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setConfirmVisible(!confirmVisible)}
              className="absolute left-3 top-3 text-[#1998e1] focus:outline-none cursor-pointer"
            >
              {confirmVisible ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* زر إعادة التعيين */}
        <button className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer">
          إعادة تعيين كلمة المرور
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
