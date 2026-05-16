"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FaCopy, FaUsers, FaCalendarAlt, FaVideo, FaFilePdf, FaFileAlt, FaCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ClassroomCard({ id, name, studentsCount, videosCount, pdfsCount, tasksCount, createdAt, status }) {
  const router = useRouter();

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    toast.success("تم نسخ الكود");
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }) : "—";

  const stats = [
    { icon: FaUsers,   val: studentsCount ?? 0, label: "طالب" },
    { icon: FaVideo,   val: videosCount ?? 0,   label: "فيديو" },
    { icon: FaFilePdf, val: pdfsCount ?? 0,     label: "ملف" },
    { icon: FaFileAlt, val: tasksCount ?? 0,    label: "مهمة" },
  ];

  return (
    <motion.div
      whileHover={{ y: -3 }}
      onClick={() => router.push(`/Pages/ClassRoom/${id}`)}
      className="card card-hover"
      style={{ padding: "1.2rem", cursor: "pointer", position: "relative" }}
    >
      {/* Top row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
        <div style={{ flex: 1, minWidth: 0, paddingLeft: "2rem" }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text-main)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.75rem" }}>
            <FaCircle style={{ fontSize: "0.55rem", color: status === "active" ? "var(--green)" : "var(--yellow)" }} />
            <span style={{ color: status === "active" ? "var(--green)" : "var(--yellow)" }}>
              {status === "active" ? "نشط" : "معلق"}
            </span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="btn btn-ghost btn-sm btn-icon"
          title="نسخ المعرّف"
          style={{ flexShrink: 0 }}
        >
          <FaCopy style={{ fontSize: "0.8rem" }} />
        </button>
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.85rem" }}>
        {stats.map(({ icon: Icon, val, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg-panel)", borderRadius: 8, padding: "0.4rem 0.7rem" }}>
            <Icon style={{ color: "var(--blue)", fontSize: "0.8rem", flexShrink: 0 }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <strong style={{ color: "var(--text-main)", marginLeft: 3 }}>{val}</strong> {label}
            </span>
          </div>
        ))}
      </div>

      {/* Date */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-dim)", fontSize: "0.75rem" }}>
        <FaCalendarAlt style={{ color: "var(--blue)", fontSize: "0.7rem" }} />
        {formatDate(createdAt)}
      </div>
    </motion.div>
  );
}
