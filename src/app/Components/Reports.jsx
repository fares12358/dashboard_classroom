"use client";
import React, { useEffect, useState } from "react";
import { useDeferredEffect } from "@/app/utils/useDeferredEffect";
import * as FaIcons from "react-icons/fa";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Reports() {
  const { reports, setReports } = useAppContext();
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/reportes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("فشل تحميل البيانات");
      const data = await res.json();
      setReports(data.reports.map(r => ({ ...r, icon: FaIcons[r.icon] || FaIcons.FaClipboardList })));
    } catch (err) {
      toast.error(err.message || "حدث خطأ أثناء تحميل التقارير");
    } finally {
      setLoading(false);
    }
  };

  useDeferredEffect(() => { if (!reports) fetchReports(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div className="section-title">التقارير والإحصائيات</div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={fetchReports} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaIcons.FaSpinner className="animate-spin" /> : <FaIcons.FaSync />}
          <span>تحديث</span>
        </motion.button>
      </div>

      {loading && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "var(--text-muted)" }}>
          <FaIcons.FaSpinner className="animate-spin" style={{ marginLeft: 8 }} /> جارٍ التحميل...
        </div>
      )}

      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1rem" }}>
          <AnimatePresence>
            {(reports || []).map((report, idx) => {
              const Icon = report.icon;
              return (
                <motion.div
                  key={idx}
                  className="stat-card"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.25 }}
                >
                  <div className="stat-icon"><Icon /></div>
                  <div>
                    <div className="stat-label">{report.title}</div>
                    <div className="stat-value">{report.value}</div>
                    <div className="stat-desc">{report.description}</div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
