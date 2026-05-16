"use client";
import React, { useState } from "react";
import {
  FaUser, FaEnvelope, FaPhone, FaCheckCircle,
  FaHourglassHalf, FaCalendarAlt, FaUserSlash,
  FaExclamationTriangle, FaTimes,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentCard({ classID, student }) {
  const { getClassData, setClassTabData } = useAppContext();
  const [kicking, setKicking] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [removed, setRemoved] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const handleKick = async () => {
    setKicking(true);
    try {
      const res = await axios.post(
        `${API_URL}/admin/classe/${classID}/student/${student._id}`,
        {},
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.success) {
        const current = getClassData(classID)?.students || [];
        setClassTabData(classID, "students", current.filter(s => s._id !== student._id));
        toast.success("تم طرد الطالب بنجاح");
        setRemoved(true);
      } else {
        toast.error(res.data.message || "فشل في طرد الطالب");
      }
    } catch {
      toast.error("حدث خطأ أثناء طرد الطالب");
    } finally {
      setKicking(false);
      setShowConfirm(false);
    }
  };

  return (
    <AnimatePresence>
      {!removed && (
        <motion.div
          key={student._id}
          className="card"
          style={{ padding: "1rem", position: "relative" }}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -40, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          {/* Kick button */}
          <button
            onClick={() => setShowConfirm(true)}
            disabled={kicking}
            className="btn btn-danger btn-sm"
            style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}
          >
            <FaUserSlash style={{ fontSize: "0.75rem" }} />
          </button>

          {/* Avatar + name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem", paddingLeft: "2.5rem" }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--blue)", flexShrink: 0,
            }}>
              <FaUser />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{student.name}</div>
              <span className={`badge ${student.status === "active" ? "badge-green" : "badge-yellow"}`} style={{ marginTop: 3 }}>
                {student.status === "active" ? <><FaCheckCircle style={{ fontSize: "0.6rem" }} /> نشط</> : <><FaHourglassHalf style={{ fontSize: "0.6rem" }} /> غير نشط</>}
              </span>
            </div>
          </div>

          <hr className="divider" style={{ margin: "0.6rem 0" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <FaEnvelope style={{ color: "var(--blue)", fontSize: "0.7rem" }} /> {student.email}
            </div>
            {student.phone && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                <FaPhone style={{ color: "var(--blue)", fontSize: "0.7rem" }} /> {student.phone}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", color: "var(--text-dim)" }}>
              <FaCalendarAlt style={{ color: "var(--blue)", fontSize: "0.7rem" }} />
              انضم: {new Date(student.createdAt).toLocaleDateString("ar-EG")}
            </div>
          </div>

          {/* Confirm modal */}
          <AnimatePresence>
            {showConfirm && (
              <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="modal-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
                  <div style={{ textAlign: "center" }}>
                    <FaExclamationTriangle style={{ color: "var(--red)", fontSize: "2.2rem", marginBottom: "0.6rem" }} />
                    <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>هل أنت متأكد؟</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.1rem" }}>
                      سيتم طرد <strong>{student.name}</strong> من الكلاس.
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                      <button onClick={handleKick} disabled={kicking} className="btn btn-danger btn-sm">
                        <FaUserSlash /> {kicking ? "جاري الطرد..." : "نعم، طرد"}
                      </button>
                      <button onClick={() => setShowConfirm(false)} className="btn btn-ghost btn-sm">
                        <FaTimes /> إلغاء
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
