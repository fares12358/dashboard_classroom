"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import StudentCard from "./StudentCard";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { FaSyncAlt, FaSpinner, FaUsers } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { if (classID) openClass(classID); }, [classID]);

  const studentsClass = getClassData(classID)?.students;

  const fetchStudents = async (force = false) => {
    if (!classID) return;
    if (studentsClass !== null && studentsClass !== undefined && !force) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/student`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.data.success) {
        setClassTabData(classID, "students", res.data.students);
      } else {
        toast.error(res.data.message || "فشل في جلب الطلاب");
      }
    } catch {
      toast.error("حدث خطأ أثناء جلب الطلاب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (classID) fetchStudents(); }, [classID]);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>الطلاب</div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{studentsClass?.length ?? 0} طالب مسجل في هذا الكلاس</div>
        </div>
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => fetchStudents(true)}
          disabled={loading}
          className="btn btn-ghost btn-sm"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* Loading */}
      {loading && !studentsClass && (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem", color: "var(--text-muted)" }}>
          <FaSpinner className="animate-spin" style={{ fontSize: "2rem" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && studentsClass?.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaUsers style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا يوجد طلاب في هذا الكلاس حتى الآن</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "0.85rem" }}>
        <AnimatePresence>
          {studentsClass?.map((student, idx) => (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 14 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
            >
              <StudentCard classID={classID} student={student} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
