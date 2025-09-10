"use client";
import React, { useState } from "react";
import VideoCard from "./Video/VideoCard";
import AddVideoSection from "./Video/AddVideoSection";
import { FaSearch, FaVideo, FaExclamationTriangle } from "react-icons/fa";

export default function VideosTab() {
  const [videos, setVideos] = useState([
    {
      name: "React Basics",
      description: "مقدمة في مكتبة React",
      url: "https://res.cloudinary.com/demo/video/upload/v1234567/sample.mp4",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/v1234567/sample.jpg",
      date: "2025-09-10",
    },
    {
      name: "Next.js Guide",
      description: "دليل عملي لـ Next.js",
      url: "https://res.cloudinary.com/demo/video/upload/v1234567/sample2.mp4",
      thumbnail: "https://res.cloudinary.com/demo/image/upload/v1234567/sample2.jpg",
      date: "2025-09-11",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleAddVideo = (video) => {
    setVideos([...videos, video]);
  };

  // فلترة الفيديوهات حسب البحث
  const filteredVideos = videos.filter((video) =>
    video.name.toLowerCase().includes(search.toLowerCase())
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

      {/* قسم إضافة الفيديو */}
      <AddVideoSection onAdd={handleAddVideo} />

      {/* عرض الفيديوهات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <VideoCard key={index} video={video} />
          ))
        ) : (
          <p className="text-gray-400 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" /> لا يوجد نتائج مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}
