"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaUser, FaCheckCircle, FaTimesCircle, FaCalendarAlt,
  FaChalkboardTeacher, FaSpinner, FaSyncAlt, FaSearch,
} from "react-icons/fa";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Students() {
  const router = useRouter();
  const { students, setStudents } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setStudents(res.data);
    } catch {
      toast.error("فشل في تحميل الطلاب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!students) fetchStudents(); }, []);

  const filtered = (students || []).filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-title">الطلاب</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{students?.length ?? 0} طالب مسجل</div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={fetchStudents} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span>تحديث</span>
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 340, marginBottom: "1.25rem" }}>
        <FaSearch style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
        <input
          className="input"
          style={{ paddingRight: "2.25rem" }}
          placeholder="بحث بالاسم أو البريد..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Loading skeleton */}
      {loading && !students && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card" style={{ padding: "1.2rem", height: 140 }}>
              <div style={{ height: 14, background: "var(--bg-card-2)", borderRadius: 6, marginBottom: 10, width: "60%" }} />
              <div style={{ height: 11, background: "var(--bg-card-2)", borderRadius: 6, width: "80%", marginBottom: 8 }} />
              <div style={{ height: 11, background: "var(--bg-card-2)", borderRadius: 6, width: "40%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaUser style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا يوجد طلاب</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
        <AnimatePresence>
          {filtered.map((student, idx) => (
            <motion.div
              key={student.id || idx}
              onClick={() => router.push(`/Pages/StudentDetails/${student.id}`)}
              className="card card-hover"
              style={{ padding: "1.2rem", cursor: "pointer" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
            >
              {/* Avatar + name */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--blue)", fontSize: "1rem", flexShrink: 0,
                }}>
                  <FaUser />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.email}</div>
                </div>
              </div>

              <hr className="divider" style={{ margin: "0.6rem 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={`badge ${student.status === "active" ? "badge-green" : "badge-red"}`}>
                  {student.status === "active" ? <><FaCheckCircle /> نشط</> : <><FaTimesCircle /> غير نشط</>}
                </span>
                <div style={{ display: "flex", gap: "0.75rem", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <FaChalkboardTeacher style={{ color: "var(--blue)" }} />
                    {student.classes?.length ?? 0}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <FaCalendarAlt style={{ color: "var(--blue)" }} />
                    {new Date(student.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
