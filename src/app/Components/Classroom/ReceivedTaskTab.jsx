"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaFilePdf, FaUser, FaEnvelope, FaPhone, FaClipboardList,
  FaSpinner, FaExclamationTriangle, FaCheckCircle, FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ReceivedTaskTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { if (classID) openClass(classID); }, [classID]);

  /* ── FIX: correct context key — stored as `receivedTasks`, not nested in `submissions` ── */
  const receivedTasks = getClassData(classID)?.receivedTasks;

  const fetchTasks = async (force = false) => {
    if (!classID) return;
    /* ── FIX: array check — don't skip if empty array, only skip if already fetched (non-null) ── */
    if (Array.isArray(receivedTasks) && !force) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/class/${classID}/tasks/submissions`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      /* backend returns { tasks: [...] } */
      setClassTabData(classID, "receivedTasks", res.data.tasks || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل تحميل التسليمات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [classID]);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <FaClipboardList style={{ color: "var(--blue)" }} /> التسليمات
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{receivedTasks?.length ?? 0} مهمة</div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => fetchTasks(true)} disabled={loading} className="btn btn-ghost btn-sm">
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
          <FaSpinner className="animate-spin" style={{ fontSize: "2rem", color: "var(--blue)" }} />
        </div>
      )}

      {/* Empty */}
      {!loading && Array.isArray(receivedTasks) && receivedTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}
        >
          <FaExclamationTriangle style={{ fontSize: "2.5rem", color: "var(--yellow)", marginBottom: "0.75rem" }} />
          <div>لا توجد تسليمات لهذا الكلاس</div>
        </motion.div>
      )}

      {/* Task list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
        <AnimatePresence>
          {!loading && receivedTasks?.map((task) => (
            <motion.div
              key={task._id}
              className="card"
              style={{ padding: "1.25rem" }}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
            >
              {/* Task header */}
              <div style={{ marginBottom: "1rem", paddingBottom: "0.85rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                  <FaClipboardList style={{ color: "var(--blue)" }} /> {task.name}
                </div>
                {task.description && <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{task.description}</p>}
                {task.url && (
                  <a href={task.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ marginTop: 6 }}>
                    <FaFilePdf style={{ color: "var(--red)" }} /> عرض ملف المهمة
                  </a>
                )}
              </div>

              {/* Submissions */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.88rem" }}>
                <FaCheckCircle style={{ color: "var(--green)" }} />
                التسليمات ({task.submissions?.length ?? 0})
              </div>

              {!task.submissions?.length ? (
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic" }}>لا توجد تسليمات بعد</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  <AnimatePresence>
                    {task.submissions.map((sub, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.04, duration: 0.22 }}
                        style={{ background: "var(--bg-panel)", borderRadius: 10, padding: "0.75rem 1rem" }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "0.5rem" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <span style={{ fontWeight: 600, fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 6 }}>
                              <FaUser style={{ color: "var(--blue)", fontSize: "0.75rem" }} />
                              {sub.student?.name || "غير معروف"}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                              <FaEnvelope style={{ fontSize: "0.7rem" }} /> {sub.student?.email || "—"}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                              <FaPhone style={{ fontSize: "0.7rem" }} /> {sub.student?.phone || "—"}
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                            {sub.solution?.url && (
                              <a href={sub.solution.url} target="_blank" rel="noopener noreferrer" className="btn btn-success btn-sm">
                                <FaFilePdf style={{ fontSize: "0.75rem" }} /> عرض الحل
                              </a>
                            )}
                            {sub.solution?.submittedAt && (
                              <span style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                                {new Date(sub.solution.submittedAt).toLocaleString("ar-EG")}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
