"use client";
import React, { useState, useEffect } from "react";
import { FaVideo, FaFileAlt, FaUpload } from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AddVideoSection({ classID, onAdd }) {
  const [videoData, setVideoData] = useState({
    name: "",
    description: "",
    videoFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  // ====== Load token from localStorage ======
  useEffect(() => {
    const saved = localStorage.getItem("yt_token");
    if (saved) setAuthToken(saved);
  }, []);

  // ====== Handle text inputs ======
  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  // ====== Handle video file select ======
  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoData({ ...videoData, videoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ====== Google Sign-in ======
  const handleLogin = () => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id:
        "481144476045-q2joha7klhtqh8n80a8ce87a8et826r2.apps.googleusercontent.com", // 👈 استبدل بالـ Client ID
      scope: "https://www.googleapis.com/auth/youtube.upload",
      callback: (tokenResponse) => {
        setAuthToken(tokenResponse.access_token);
        localStorage.setItem("yt_token", tokenResponse.access_token);
        toast.success("تم تسجيل الدخول بنجاح ✅");
      },
    });

    client.requestAccessToken();
  };

  // ====== Save metadata in backend ======
  const saveVideoMetadata = async (classID, video) => {
    try {
      console.log('vd',video);
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/classe/${classID}/video`,
        {
          videoId: video.videoId,
          name: video.name,
          description: video.description,
        }
      );
      return response.data;
    } catch (err) {
      console.error("Error saving video metadata:", err.response || err);
      toast.error("فشل حفظ بيانات الفيديو ⚠️");
      throw err;
    }
  };

  // ====== Upload to YouTube ======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoData.name || !videoData.description || !videoData.videoFile) return;
    toast.error("الرجاء إدخال كل البيانات المطلوبة ⚠️");
    if (!authToken) {
      toast.error("سجّل دخول Google أولاً ⚠️");
      return;
    }

    try {
      // 1️⃣ Start resumable upload
      const startRes = await fetch(
        "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            snippet: {
              title: videoData.name,
              description: videoData.description,
            },
            status: {
              privacyStatus: "private",
            },
          }),
        }
      );

      if (!startRes.ok) throw new Error("Failed to start upload");
      const uploadUrl = startRes.headers.get("location");

      // 2️⃣ Upload actual file with progress
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const percent = Math.round((evt.loaded / evt.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);

          try {
            // Save metadata in backend
            await saveVideoMetadata(classID, {
              videoId: data.id,
              name: videoData.name,
              description: videoData.description,
            });

            // Update parent UI
            if (onAdd) {
              onAdd({
                videoId: data.id,
                name: videoData.name,
                description: videoData.description,
              });
            }

            setVideoData({ name: "", description: "", videoFile: null });
            setPreview(null);
            setProgress(0);
            toast.success("✅ تم رفع الفيديو وحفظ البيانات بنجاح");
          } catch (err) {
            toast.error("⚠️ فشل في حفظ البيانات");
          }
        } else {
          console.error("Upload failed:", xhr.responseText);
          toast.error("⚠️ فشل رفع الفيديو");
        }
      };

      xhr.onerror = () => {
        toast.error("⚠️ حدث خطأ أثناء الرفع");
      };

      xhr.send(videoData.videoFile);
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("⚠️ فشل رفع الفيديو. تحقق من الكونسول للتفاصيل");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111] rounded-xl shadow-md p-4 sm:p-6 mb-6 flex flex-col gap-5"
    >
      <Toaster/>
      <h3 className="text-lg sm:text-xl font-bold text-[#1998e1] flex items-center gap-2">
        <FaUpload /> إضافة فيديو جديد
      </h3>


      {!authToken && (
        <button
          type="button"
          onClick={handleLogin}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          تسجيل الدخول بـ Google
        </button>
      )}

      <div className="flex items-center gap-2">
        <FaVideo className="text-[#1998e1]" />
        <input
          type="text"
          name="name"
          value={videoData.name}
          onChange={handleChange}
          placeholder="اسم الفيديو"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <FaFileAlt className="text-[#1998e1]" />
        <input
          type="text"
          name="description"
          value={videoData.description}
          onChange={handleChange}
          placeholder="وصف الفيديو"
          className="w-full p-2 rounded-lg bg-[#1a1a1a] text-white outline-none"
        />
      </div>

      <label className="w-full aspect-video border-2 border-dashed border-[#1998e1]/40 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1998e1] transition">
        {preview ? (
          <video
            src={preview}
            className="w-full h-full object-cover rounded-lg"
            controls
          />
        ) : (
          <div className="flex flex-col items-center text-gray-400">
            <FaVideo className="text-4xl text-[#1998e1] mb-2" />
            <span>إرفع الفيديو هنا</span>
          </div>
        )}
        <input type="file" accept="video/*" onChange={handleVideoFile} hidden />
      </label>

      {progress > 0 && (
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-[#1998e1] h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <button
        type="submit"
        className="bg-[#1998e1] hover:bg-[#127bbf] transition p-2 rounded-lg text-white font-medium"
      >
        رفع الفيديو
      </button>
    </form>
  );
}
