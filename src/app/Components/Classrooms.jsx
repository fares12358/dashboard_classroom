"use client";
import React, { useState, useEffect } from "react";
import ClassroomCard from "../Components/ClassroomCard";
import { useAppContext } from "../Context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FaPlus, FaSpinner, FaTimes, FaSyncAlt, FaChalkboardTeacher } from "react-icons/fa";
import { API_URL } from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Classrooms() {
  const { classrooms, setClassrooms } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchClasses = async () => {
    setPageLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classes`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClassrooms(res.data);
    } catch {
      toast.error("فشل في تحميل الكلاسات");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { if (!classrooms?.length) fetchClasses(); }, []);

  const handleAddClass = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const description = form.description.trim();
    if (!name || !description) { toast.error("الرجاء إدخال جميع البيانات"); return; }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/classe/add`, { name, description }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("تم إضافة الكلاس بنجاح");
      setForm({ name: "", description: "" });
      setIsAdding(false);
      await fetchClasses();
    } catch {
      toast.error("فشل في إضافة الكلاس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-title">الكلاسات</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{classrooms?.length ?? 0} فصل دراسي</div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={fetchClasses} disabled={pageLoading} className="btn btn-ghost btn-sm">
            {pageLoading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
            <span>تحديث</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsAdding(v => !v)}
            className={isAdding ? "btn btn-danger btn-sm" : "btn btn-primary btn-sm"}
          >
            {isAdding ? <FaTimes /> : <FaPlus />}
            {isAdding ? "إلغاء" : "إضافة كلاس"}
          </motion.button>
        </div>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            onSubmit={handleAddClass}
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="card"
            style={{ padding: "1.4rem", marginBottom: "1.25rem" }}
          >
            <div style={{ fontWeight: 700, marginBottom: "1rem", color: "var(--blue)" }}>كلاس جديد</div>
            <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>اسم الكلاس</label>
                <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="أدخل اسم الكلاس" />
              </div>
              <div>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 4 }}>الوصف</label>
                <textarea className="input" style={{ resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="أدخل وصف الكلاس" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {loading ? "جاري الإضافة..." : "إضافة"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Loading skeleton */}
      {pageLoading && !classrooms?.length && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ padding: "1.2rem", height: 160 }}>
              <div style={{ height: 14, background: "var(--bg-card-2)", borderRadius: 6, marginBottom: 12, width: "55%" }} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[...Array(4)].map((_, j) => (
                  <div key={j} style={{ height: 32, background: "var(--bg-card-2)", borderRadius: 8 }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!pageLoading && !classrooms?.length && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaChalkboardTeacher style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا توجد كلاسات حتى الآن</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
        <AnimatePresence>
          {classrooms?.map((classroom, idx) => (
            <motion.div
              key={classroom.id || idx}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.04, duration: 0.25 }}
            >
              <ClassroomCard {...classroom} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
