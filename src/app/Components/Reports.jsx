"use client";
import React from "react";
import ReportCard from "../Components/ReportCard";
import {
  FaUsers,
  FaUserCheck,
  FaUserSlash,
  FaDollarSign,
  FaChalkboardTeacher,
  FaClipboardList,
  FaFileAlt,
  FaVideo,
  FaTasks,
} from "react-icons/fa";

const Reports = () => {
  const reports = [
    {
      title: "إجمالي الطلاب",
      description: "عدد الطلاب المسجلين.",
      icon: FaUsers,
      value: 245,
    },
    {
      title: "الطلاب النشطون",
      description: "عدد الطلاب المتفاعلين.",
      icon: FaUserCheck,
      value: 180,
    },
    {
      title: "الطلاب غير النشطين",
      description: "عدد الطلاب غير المتفاعلين.",
      icon: FaUserSlash,
      value: 65,
    },
    {
      title: "إجمالي الأرباح",
      description: "الأرباح المحققة حتى الآن.",
      icon: FaDollarSign,
      value: "$12,340",
    },
    {
      title: "الكلاسات النشطة",
      description: "عدد الكلاسات الحالية.",
      icon: FaChalkboardTeacher,
      value: 18,
    },
    {
      title: "الخطط التعليمية",
      description: "عدد الخطط المتاحة.",
      icon: FaClipboardList,
      value: 6,
    },
    {
      title: "عدد الملفات",
      description: "إجمالي الملفات المرفوعة.",
      icon: FaFileAlt,
      value: 42,
    },
    {
      title: "عدد الفيديوهات",
      description: "إجمالي الفيديوهات التعليمية.",
      icon: FaVideo,
      value: 25,
    },
    {
      title: "عدد الأمتحانات",
      description: "إجمالي المهام المضافة.",
      icon: FaTasks,
      value: 12,
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
            value={report.value}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
