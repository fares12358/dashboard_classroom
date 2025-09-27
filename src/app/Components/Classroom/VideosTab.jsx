"use client";
import React, { useState, useEffect } from "react";
import VideoCard from "./Video/VideoCard";
import AddVideoSection from "./Video/AddVideoSection";
import { FaSearch, FaVideo, FaExclamationTriangle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_URL } from "@/app/utils/api";

export default function VideosTab({ classID }) {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ جلب الفيديوهات من الـ backend
  const fetchVideos = async () => {
    if (!classID) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/admin/classe/${classID}/video`
      );
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
      toast.error("فشل في تحميل الفيديوهات");
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحميل الفيديوهات عند فتح التاب أو تغيير classID
  useEffect(() => {
    fetchVideos();
  }, [classID]);

  // ✅ فلترة الفيديوهات بالبحث
  const filteredVideos = videos.filter((video) =>
    video.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-6">
      {/* العنوان */}
      <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
        <FaVideo className="text-[#1998e1]" /> الفيديوهات
      </h2>

      {/* شريط البحث */}
      <div className="relative w-full md:w-1/2">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن فيديو بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] text-white outline-none border border-gray-700 focus:border-[#1998e1] transition"
        />
      </div>

      {/* إضافة الفيديو */}
      <AddVideoSection classID={classID} onAdd={fetchVideos} />

      {/* عرض الفيديوهات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400">⏳ جاري تحميل الفيديوهات...</p>
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard
              key={video._id}
              classID={classID}
              onDelete={fetchVideos}
              video={video}
            />
          ))
        ) : (
          <p className="text-gray-400 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" /> لا يوجد نتائج
            فيديوهات.
          </p>
        )}
      </div>
    </div>
  );
}
