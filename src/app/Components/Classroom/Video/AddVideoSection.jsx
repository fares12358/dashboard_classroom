"use client";
import React, { useState } from "react";
import { FaVideo, FaFileAlt, FaUpload, FaSpinner } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "@/app/utils/api";
import { motion } from "framer-motion";

export default function AddVideoSection({ classID, onAdd }) {
  const [videoData, setVideoData] = useState({ name: "", description: "", videoFile: null });
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const handleChange = (e) => setVideoData({ ...videoData, [e.target.name]: e.target.value });

  const handleVideoFile = (e) => {
    const f = e.target.files[0];
    if (f) { setVideoData({ ...videoData, videoFile: f }); setPreview(URL.createObjectURL(f)); }
  };

  const getFreshToken = () =>
    new Promise((resolve) => {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: "481144476045-q2joha7klhtqh8n80a8ce87a8et826r2.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/youtube.upload",
        callback: (tr) => resolve(tr.access_token),
      });
      client.requestAccessToken({ prompt: "consent" });
    });

  const saveMetadata = async (videoId) => {
    const token = getToken();
    await axios.post(
      `${API_URL}/admin/classe/${classID}/video`,
      { videoId, name: videoData.name, description: videoData.description },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoData.videoFile) { toast.error("من فضلك اختر فيديو"); return; }
    setUploading(true);
    try {
      const accessToken = await getFreshToken();
      const metadata = {
        snippet: {
          title: videoData.name || "Untitled",
          description: videoData.description || "",
          categoryId: "22",
        },
        status: { privacyStatus: "unlisted" },
      };
      const startRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json; charset=UTF-8",
            "X-Upload-Content-Length": videoData.videoFile.size,
            "X-Upload-Content-Type": videoData.videoFile.type,
          },
          body: JSON.stringify(metadata),
        }
      );
      if (!startRes.ok) throw new Error("فشل بدء رفع الفيديو");
      const uploadUrl = startRes.headers.get("location");

      const uploadRes = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl, true);
        xhr.setRequestHeader("Content-Type", videoData.videoFile.type);
        xhr.upload.onprogress = (ev) => { if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100)); };
        xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve(xhr.responseText) : reject(xhr.responseText);
        xhr.onerror = () => reject("فشل الرفع");
        xhr.send(videoData.videoFile);
      });

      const parsed = JSON.parse(uploadRes);
      await saveMetadata(parsed.id);
      toast.success("تم رفع الفيديو بنجاح");
      if (onAdd) onAdd();
      setVideoData({ name: "", description: "", videoFile: null });
      setPreview(null);
      setProgress(0);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "فشل رفع الفيديو");
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: "1.25rem", marginBottom: "1.25rem" }}>
      <div style={{ fontWeight: 700, color: "var(--blue)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 6 }}>
        <FaUpload style={{ fontSize: "0.85rem" }} /> إضافة فيديو جديد
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "0.85rem" }}>
        <div style={{ position: "relative" }}>
          <FaVideo style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
          <input className="input" style={{ paddingRight: "2.2rem" }} type="text" name="name" value={videoData.name} onChange={handleChange} placeholder="اسم الفيديو" />
        </div>
        <div style={{ position: "relative" }}>
          <FaFileAlt style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
          <input className="input" style={{ paddingRight: "2.2rem" }} type="text" name="description" value={videoData.description} onChange={handleChange} placeholder="وصف الفيديو" />
        </div>

        <label className="drop-zone" style={{ aspectRatio: preview ? "16/9" : "auto", minHeight: preview ? "auto" : 100, overflow: "hidden" }}>
          {preview ? (
            <video src={preview} style={{ width: "100%", borderRadius: 8 }} controls />
          ) : (
            <>
              <FaVideo style={{ fontSize: "1.75rem", color: "var(--blue)" }} />
              <span>ارفع الفيديو هنا</span>
            </>
          )}
          <input type="file" accept="video/*" onChange={handleVideoFile} hidden />
        </label>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{progress}%</div>
        </div>
      )}

      <motion.button type="submit" disabled={uploading} whileTap={{ scale: 0.95 }} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
        {uploading ? <><FaSpinner className="animate-spin" /> جارٍ الرفع...</> : <><FaUpload /> رفع الفيديو</>}
      </motion.button>
    </form>
  );
}
