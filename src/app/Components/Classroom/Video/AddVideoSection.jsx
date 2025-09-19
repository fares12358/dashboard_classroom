"use client";
import React, { useState } from "react";
import { FaVideo, FaFileAlt, FaUpload, FaImage } from "react-icons/fa";

export default function AddVideoSection({ onAdd }) {
  const [videoData, setVideoData] = useState({
    name: "",
    description: "",
    videoFile: null,
  });

  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleVideoFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoData({ ...videoData, videoFile: file });
      setPreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !videoData.name ||
      !videoData.description ||
      !videoData.videoFile
    ) return;
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          onAdd(videoData);
          setVideoData({
            name: "",
            description: "",
            videoFile: null,
          });
          setPreview(null);
        }
        return p + 10;
      });
    }, 200);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#111] rounded-xl shadow-md p-4 sm:p-6 mb-6 flex flex-col gap-5"
    >
      <h3 className="text-lg sm:text-xl font-bold text-[#1998e1] flex items-center gap-2">
        <FaUpload /> إضافة فيديو جديد
      </h3>

      {/* اسم الفيديو */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <FaVideo className="text-[#1998e1] flex-shrink-0 mt-1 sm:mt-0" />
        <input
          type="text"
          name="name"
          value={videoData.name}
          onChange={handleChange}
          placeholder="اسم الفيديو"
          className="w-full p-2 sm:p-3 rounded-lg bg-[#1a1a1a] text-white outline-none text-sm sm:text-base"
        />
      </div>

      {/* الوصف */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <FaFileAlt className="text-[#1998e1] flex-shrink-0 mt-1 sm:mt-0" />
        <input
          type="text"
          name="description"
          value={videoData.description}
          onChange={handleChange}
          placeholder="وصف الفيديو"
          className="w-full p-2 sm:p-3 rounded-lg bg-[#1a1a1a] text-white outline-none text-sm sm:text-base"
        />
      </div>

      {/* Video + Thumbnail upload */}
      <div className="flex items-center flex-col md:flex-row justify-center gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          {/* مربع رفع الفيديو */}
          <div className="flex flex-col gap-3">
            <label className="w-full aspect-video border-2 border-dashed border-[#1998e1]/40 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#1998e1] transition">
              {preview ? (
                <video
                  src={preview}
                  className="w-full h-full object-cover rounded-lg"
                  controls
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400 text-sm sm:text-base">
                  <FaVideo className="text-3xl sm:text-4xl text-[#1998e1] mb-2" />
                  <span>إرفع الفيديو هنا</span>
                </div>
              )}
              <input type="file" accept="video/*" onChange={handleVideoFile} hidden />
            </label>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {progress > 0 && progress < 100 && (
        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
          <div
            className="bg-[#1998e1] h-2 sm:h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* زر الحفظ */}
      <button
        type="submit"
        className="bg-[#1998e1] hover:bg-[#127bbf] transition p-2 sm:p-3 rounded-lg text-white font-medium text-sm sm:text-base cursor-pointer"
      >
        رفع الفيديو
      </button>
    </form>
  );
}
