'use client'
import React from "react";
import { FaEnvelope } from "react-icons/fa";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5" dir="rtl">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          نسيت كلمة المرور
        </h2>
        <p className="text-gray-400 text-center mb-6">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور الخاصة بك.
        </p>

        {/* البريد الإلكتروني */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">البريد الإلكتروني</label>
          <div className="relative">
            <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
            <input
              type="email"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="أدخل بريدك الإلكتروني"
            />
          </div>
        </div>

        {/* زر الإرسال */}
        <button className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer">
          إرسال رابط إعادة التعيين
        </button>

        {/* الرجوع لتسجيل الدخول */}
        <div className="mt-6 text-center">
          <a
            href="/Pages/Auth/login"
            className="text-[#1998e1] text-sm hover:underline cursor-pointer"
          >
            الرجوع إلى تسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
