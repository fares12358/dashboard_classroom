'use client'
import { useAppContext } from "@/app/Context/AppContext";
import Link from "next/link";
import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { sidebarOpen, setSidebarOpen, isLogin, setIsLogin, user, setUser } = useAppContext();
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLogin(true);
    setUser([{ id: 1 }]);
    router.push(`/`);

  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090909] p-5">
      <div className="w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          تسجيل الدخول
        </h2>

        {/* اسم المستخدم */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">اسم المستخدم</label>
          <div className="relative">
            <FaUser className="absolute right-3 top-3 text-gray-400" />
            <input
              type="text"
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="ادخل اسم المستخدم"
            />
          </div>
        </div>

        {/* كلمة المرور */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">كلمة المرور</label>
          <div className="relative">
            <FaLock className="absolute right-3 top-3 text-gray-400" />
            <input
              type={passwordVisible ? "text" : "password"}
              className="w-full pr-10 pl-4 py-2 rounded-lg bg-[#2c2c2c] text-white focus:outline-none focus:ring-2 focus:ring-[#1998e1]"
              placeholder="ادخل كلمة المرور"
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

        {/* نسيت كلمة المرور */}
        <div className="flex justify-start mb-6">
          <Link
            href={"/Pages/Auth/forgetPassword"}
            className="flex items-center gap-2 text-[#1998e1] text-sm hover:underline cursor-pointer"
          >
            <FaKey /> نسيت كلمة المرور؟
          </Link>
        </div>

        {/* زر تسجيل الدخول */}
        <button className="w-full py-2 bg-[#1998e1] text-white font-semibold rounded-lg hover:bg-[#1578b5] transition cursor-pointer" onClick={handleLogin}>
          دخول
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
