"use client";
import React from "react";
import {
  FaUsers,
  FaDollarSign,
  FaChalkboardTeacher,
} from "react-icons/fa";
import ClassroomCard from "./ClassroomCard";

const DashboardHome = ({ classrooms }) => {
  return (
    <div>
      {/* الشريط العلوي */}
      <div className="flex justify-start items-center mb-8">
        <h2 className="text-2xl font-semibold mr-10">مرحباً بعودتك 👋 محمد</h2>
      </div>

      {/* إحصائيات لوحة التحكم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* عدد الطلاب */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl">
            <FaUsers />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1998e1]">عدد الطلاب</h3>
            <p className="text-2xl font-bold mt-2">
              {classrooms.reduce((acc, c) => acc + c.students, 0)}
            </p>
          </div>
        </div>

        {/* عدد الفصول الدراسية */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl">
            <FaChalkboardTeacher />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1998e1]">عدد الفصول</h3>
            <p className="text-2xl font-bold mt-2">{classrooms.length}</p>
          </div>
        </div>

        {/* الأموال من خطط الدفع */}
        <div className="bg-[#1a1a1a] p-6 rounded-xl shadow-md flex items-center gap-4">
          <div className="p-3 bg-[#1998e1]/20 rounded-full text-[#1998e1] text-2xl">
            <FaDollarSign />
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#1998e1]">إجمالي الأرباح</h3>
            <p className="text-2xl font-bold mt-2">
              ${classrooms.reduce((acc, c) => acc + c.students, 0) * 50}
            </p>
          </div>
        </div>
      </div>

      {/* قائمة الكلاسات */}
      <h2 className="text-xl font-semibold mb-4">الفصول الدراسية</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {classrooms.map((classroom, index) => (
          <ClassroomCard
            key={index}
            {...classroom} // تمرير جميع البيانات مرة واحدة
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;
