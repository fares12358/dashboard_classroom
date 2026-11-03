"use client";
import React, { useState, useEffect } from "react";
import { useDeferredEffect } from "@/app/utils/useDeferredEffect";
import VideoCard from "./Video/VideoCard";
import AddVideoSection from "./Video/AddVideoSection";
import { FaSearch, FaVideo, FaExclamationTriangle, FaSyncAlt, FaSpinner } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "@/app/utils/api";
import { motion, AnimatePresence } from "framer-motion";

export default function VideosTab({ classID }) {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchVideos = async () => {
    if (!classID) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/video`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setVideos(res.data.videos || []);
    } catch {
      toast.error("فشل في تحميل الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  useDeferredEffect(() => { fetchVideos(); }, [classID]);

  const filtered = videos.filter(v => v.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
            <FaVideo style={{ color: "var(--blue)" }} /> الفيديوهات
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>{videos.length} فيديو</div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={fetchVideos} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: 320, marginBottom: "1.25rem" }}>
        <FaSearch style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
        <input
          className="input"
          style={{ paddingRight: "2.25rem" }}
          placeholder="بحث بالاسم..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Add video */}
      <AddVideoSection classID={classID} onAdd={fetchVideos} />

      {/* Videos grid */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <FaSpinner className="animate-spin" style={{ fontSize: "2rem", color: "var(--blue)" }} />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>
          <FaExclamationTriangle style={{ color: "var(--yellow)", marginBottom: "0.5rem" }} />
          <div>لا توجد فيديوهات</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "1rem" }}>
        <AnimatePresence>
          {filtered.map((video, idx) => (
            <motion.div
              key={video._id}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
            >
              <VideoCard classID={classID} onDelete={fetchVideos} video={video} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
