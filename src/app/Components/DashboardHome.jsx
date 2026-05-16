"use client";
import React, { useEffect, useState } from "react";
import * as FaIcons from "react-icons/fa";
import ClassroomCard from "./ClassroomCard";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import { API_URL } from "../utils/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardHome() {
  const { user, classrooms, setClassrooms, homeReport, setHomeReport } = useAppContext();
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) return;
      const [resClasses, resReports] = await Promise.all([
        axios.get(`${API_URL}/admin/classes`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/admin/homeReport`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setClassrooms(resClasses.data);
      setHomeReport(resReports.data);
      toast.success("تم التحديث");
    } catch {
      toast.error("فشل تحديث البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (homeReport) return;
    const token = getToken();
    if (!token) return;
    axios.get(`${API_URL}/admin/homeReport`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setHomeReport(res.data))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.75rem", marginTop: "0.25rem" }}>
        <div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800 }}>
            مرحباً {user?.name} 👋
          </div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 2 }}>
            إليك ملخص يوم اليوم
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={handleRefresh} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaIcons.FaSpinner className="animate-spin" /> : <FaIcons.FaSync />}
          <span>تحديث</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <AnimatePresence>
          {homeReport?.reports?.map((report, idx) => {
            const Icon = FaIcons[report.icon] || FaIcons.FaUsers;
            return (
              <motion.div
                key={idx}
                className="stat-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.3 }}
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

      {/* Classrooms header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>الفصول الدراسية</div>
        <span className="badge badge-blue">{classrooms?.length || 0} كلاس</span>
      </div>

      {!classrooms || classrooms.length === 0 ? (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaIcons.FaChalkboardTeacher style={{ fontSize: "2.5rem", marginBottom: "0.75rem", color: "var(--text-dim)" }} />
          <div>لا توجد فصول دراسية متاحة حالياً</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
          {classrooms.map((classroom, idx) => (
            <motion.div
              key={classroom.id || idx}
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.28 }}
            >
              <ClassroomCard {...classroom} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
