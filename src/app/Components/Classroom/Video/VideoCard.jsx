"use client";
import React, { useState } from "react";
import axios from "axios";
import { FaPlay, FaCalendarAlt, FaTrash, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import toast from "react-hot-toast";
import { API_URL } from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function VideoCard({ video, classID, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  /* ── FIX: video delete uses admin JWT, not YouTube OAuth ── */
  const confirmDeleteAction = async () => {
    try {
      setLoading(true);
      const token = getToken();
      await axios.delete(`${API_URL}/admin/classe/${classID}/video/${video._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("تم حذف الفيديو بنجاح");
      if (onDelete) onDelete();
    } catch {
      toast.error("فشل حذف الفيديو");
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <motion.div
        className="card card-hover"
        style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
        whileHover={{ y: -2 }}
      >
        {/* Embed */}
        <div style={{ borderRadius: 10, overflow: "hidden", aspectRatio: "16/9" }}>
          <iframe
            style={{ width: "100%", height: "100%", border: "none" }}
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0&modestbranding=1&controls=1`}
            title={video.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Info */}
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <FaPlay style={{ color: "var(--blue)", fontSize: "0.75rem" }} />
            {video.name}
          </div>
          {video.description && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>{video.description}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-dim)", fontSize: "0.75rem" }}>
            <FaCalendarAlt style={{ color: "var(--blue)", fontSize: "0.7rem" }} />
            {new Date(video.uploadedAt).toLocaleDateString("ar-EG")}
          </div>
        </div>

        <button
          onClick={() => setConfirmDelete(true)}
          disabled={loading}
          className="btn btn-danger btn-sm"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <FaTrash /> {loading ? "جارٍ الحذف..." : "حذف الفيديو"}
        </button>
      </motion.div>

      {/* Delete modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
              <div style={{ textAlign: "center" }}>
                <FaExclamationTriangle style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>هل أنت متأكد من حذف الفيديو؟</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                  سيتم حذف الفيديو من YouTube وقاعدة البيانات.
                </div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={confirmDeleteAction} disabled={loading} className="btn btn-danger">
                    <FaTrash /> {loading ? "جارٍ الحذف..." : "حذف"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost">
                    <FaTimes /> إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
