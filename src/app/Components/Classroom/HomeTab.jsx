"use client";
import React, { useState, useEffect } from "react";
import {
  FaUsers, FaCalendarAlt, FaTrash, FaEdit, FaCheckCircle,
  FaClock, FaSync, FaTimes, FaSpinner, FaExclamationTriangle,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useAppContext } from "@/app/Context/AppContext";
import { useRouter } from "next/navigation";
import { API_URL } from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeTab({ classID }) {
  const router = useRouter();
  const { openClass, getClassData, setClassTabData } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [className, setClassName] = useState("");
  const [status, setStatus] = useState("pending");
  const [description, setDescription] = useState("");

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { openClass(classID); }, [classID]);

  const classData = getClassData(classID)?.home;

  const fetchClass = async (force = false) => {
    if (classData && !force) {
      setClassName(classData.name || "");
      setStatus(classData.status || "pending");
      setDescription(classData.description || "");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClassTabData(classID, "home", res.data);
      setClassName(res.data.name || "");
      setStatus(res.data.status || "pending");
      setDescription(res.data.description || "");
    } catch {
      toast.error("فشل تحميل بيانات الكلاس");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClass(); }, [classID]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${API_URL}/admin/classe/${classID}`,
        { name: className, description, status },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("تم تعديل بيانات الكلاس بنجاح");
      setIsEditing(false);
      await fetchClass(true);
    } catch {
      toast.error("فشل تعديل الكلاس");
    } finally {
      setLoading(false);
    }
  };

  /* ── FIX: delete uses adminToken, NOT YouTube OAuth token ── */
  const onDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/classe/${classID}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("تم حذف الكلاس بنجاح");
      setShowDeleteModal(false);
      router.push("/");
    } catch {
      toast.error("فشل حذف الكلاس");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, position: "relative" }}>
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
          >
            <div className="spinner" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="card" style={{ padding: "1.5rem", position: "relative" }}>
        {/* Action buttons top-right */}
        <div style={{ position: "absolute", top: "1rem", left: "1rem", display: "flex", gap: "0.5rem" }}>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => fetchClass(true)} className="btn btn-ghost btn-sm btn-icon" title="تحديث">
            <FaSync style={{ fontSize: "0.8rem" }} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(true)} className="btn btn-ghost btn-sm btn-icon" title="تعديل">
            <FaEdit style={{ fontSize: "0.8rem" }} />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowDeleteModal(true)} className="btn btn-danger btn-sm btn-icon" title="حذف">
            <FaTrash style={{ fontSize: "0.8rem" }} />
          </motion.button>
        </div>

        {/* View / Edit content */}
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ paddingTop: "2.5rem" }}
            >
              <div style={{ marginBottom: "0.85rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 5 }}>اسم الكلاس</label>
                <input className="input" value={className} onChange={e => setClassName(e.target.value)} />
              </div>
              <div style={{ marginBottom: "0.85rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 5 }}>الحالة</label>
                <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="active">نشط</option>
                  <option value="pending">معلق</option>
                </select>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 5 }}>الوصف</label>
                <textarea className="input" style={{ minHeight: 80, resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button onClick={handleSave} disabled={loading} className="btn btn-success">
                  {loading ? <FaSpinner className="animate-spin" /> : null} حفظ
                </button>
                <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
                  <FaTimes /> إلغاء
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ paddingTop: "2rem" }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.4rem" }}>
                  {classData?.name || "—"}
                </h1>
                <span className={`badge ${classData?.status === "active" ? "badge-green" : "badge-yellow"}`}>
                  {classData?.status === "active" ? <><FaCheckCircle style={{ fontSize: "0.65rem" }} /> نشط</> : <><FaClock style={{ fontSize: "0.65rem" }} /> معلق</>}
                </span>
              </div>

              <hr className="divider" />

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  <FaUsers style={{ color: "var(--blue)" }} />
                  <span>عدد الطلاب:</span>
                  <strong style={{ color: "var(--text-main)" }}>{classData?.studentsCount ?? 0}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  <FaCalendarAlt style={{ color: "var(--blue)" }} />
                  <span>تاريخ الإنشاء:</span>
                  <strong style={{ color: "var(--text-main)" }}>
                    {classData?.createdAt ? new Date(classData.createdAt).toLocaleDateString("ar-EG") : "—"}
                  </strong>
                </div>
              </div>

              {classData?.description && (
                <div style={{ background: "var(--bg-panel)", borderRadius: 10, padding: "0.85rem 1rem" }}>
                  <div style={{ fontSize: "0.8rem", color: "var(--blue)", fontWeight: 600, marginBottom: 5 }}>الوصف</div>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: 1.7 }}>{classData.description}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} transition={{ duration: 0.25 }}>
              <div style={{ textAlign: "center" }}>
                <FaExclamationTriangle style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.5rem" }}>هل أنت متأكد من الحذف؟</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                  سيتم حذف الكلاس وجميع محتوياته بشكل نهائي ولا يمكن التراجع.
                </div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={onDelete} disabled={loading} className="btn btn-danger">
                    {loading ? <FaSpinner className="animate-spin" /> : <FaTrash />} حذف
                  </button>
                  <button onClick={() => setShowDeleteModal(false)} className="btn btn-ghost">
                    <FaTimes /> إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
