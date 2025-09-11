"use client";
import React from "react";
import { FaCalendarAlt, FaMoneyBillWave, FaInfoCircle } from "react-icons/fa";

export default function PlanCard({ title, duration, price, description }) {
  return (
    <div
      className="bg-gradient-to-br from-[#1e1e1e] to-[#151515] p-6 rounded-2xl shadow-lg 
                 hover:shadow-xl hover:scale-[1.01] transition-all border border-[#2a2a2a] flex flex-col gap-4"
    >
      {/* اسم الخطة */}
      <h3 className="text-lg font-bold text-[#1998e1]">{title}</h3>

      {/* المدة */}
      <div className="flex items-center gap-2 text-gray-300 text-sm">
        <FaCalendarAlt className="text-[#1998e1]" />
        <span>{duration}</span>
      </div>

      {/* السعر */}
      <div className="flex items-center gap-2 text-white text-xl font-bold mt-2">
        <FaMoneyBillWave className="text-green-400" />
        {price}
      </div>

      {/* الوصف */}
      {description && (
        <div className="flex items-start gap-2 text-gray-400 text-sm mt-2 leading-relaxed">
          <FaInfoCircle className="text-[#1998e1] mt-0.5" />
          <span>{description}</span>
        </div>
      )}
    </div>
  );
}
