"use client";
import React from "react";
import ReportCard from "../Components/ReportCard";
import { FaUsers, FaDollarSign, FaChalkboardTeacher, FaClipboardList } from "react-icons/fa";

const Reports = () => {
  const reports = [
    {
      title: "تقرير الطلاب",
      description: "عدد الطلاب المسجلين.",
      icon: FaUsers,
      value: 245,
    },
    {
      title: "تقرير الأرباح",
      description: "إجمالي الأرباح.",
      icon: FaDollarSign,
      value: "$12,340",
    },
    {
      title: "تقرير الكلاسات",
      description: "عدد الكلاسات النشطة.",
      icon: FaChalkboardTeacher,
      value: 18,
    },
    {
      title: "تقرير الخطط",
      description: "عدد الخطط التعليمية.",
      icon: FaClipboardList,
      value: 6,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">التقارير</h2>

      {/* شبكة التقارير */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard
            key={index}
            title={report.title}
            description={report.description}
            icon={report.icon}
            value={report.value} // ✅ نمرر القيمة بدل المسار
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
