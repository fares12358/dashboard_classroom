"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlay, FaCalendarAlt } from "react-icons/fa";

export default function VideoCard({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/Pages/ClassRoom/VideoDetails/${video.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="bg-[#111] rounded-xl shadow-md p-4 flex flex-col gap-3 cursor-pointer hover:shadow-lg hover:bg-[#1a1a1a] transition"
    >
      {/* صورة معاينة الفيديو أو الفيديو عند التشغيل */}
      <div className="relative w-full rounded-lg overflow-hidden">
        {!isPlaying ? (
          <>
            {/* صورة الفيديو */}
            <img
              src={video.thumbnail}
              alt={video.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            {/* زر التشغيل */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // منع التنقل عند الضغط فقط على زر التشغيل
                setIsPlaying(true);
              }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition"
            >
              <FaPlay className="text-white text-3xl" />
            </button>
          </>
        ) : (
          <video
            controls
            autoPlay
            className="w-full rounded-lg"
            src={video.url}
            onClick={(e) => e.stopPropagation()} // منع التنقل عند التحكم بالفيديو
          />
        )}
      </div>

      {/* بيانات الفيديو */}
      <div className="flex flex-col">
        <span className="text-white font-semibold flex items-center gap-2">
          <FaPlay className="text-[#1998e1]" /> {video.name}
        </span>
        <p className="text-gray-400 text-sm">{video.description}</p>
        <span className="text-gray-500 text-xs mt-1 flex items-center gap-1">
          <FaCalendarAlt className="text-[#1998e1]" /> {video.date}
        </span>
      </div>
    </div>
  );
}
