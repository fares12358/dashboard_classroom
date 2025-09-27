"use client";
import React, { useEffect, useState } from "react";
import ReportCard from "../Components/ReportCard";
import * as FaIcons from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "../utils/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/admin/reportes`);
        if (!res.ok) throw new Error("فشل تحميل البيانات");
        const data = await res.json();

        const mappedReports = data.reports.map((report) => ({
          ...report,
          icon: FaIcons[report.icon] || FaIcons.FaClipboardList,
        }));

        setReports(mappedReports);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        toast.error(err.message || "حدث خطأ أثناء تحميل التقارير");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <Toaster position="top-right" />
      <h2 className="text-2xl font-bold mb-6 mr-10 md:mr-0">التقارير</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaIcons.FaSpinner className="animate-spin text-4xl text-[#1998e1]" />
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Reports;
