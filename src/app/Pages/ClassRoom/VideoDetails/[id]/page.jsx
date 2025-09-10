"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaPlay,
  FaCalendarAlt,
  FaArrowLeft,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaUpload,
  FaImage,
  FaVideo,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

export default function VideoDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setActiveTab } = useAppContext();

  // بيانات مؤقتة
  const mockVideo = {
    id,
    name: "فيديو تجريبي",
    description: "هذا وصف الفيديو.",
    url: "/videos/sample.mp4",
    thumbnail: "/images/sample-thumbnail.jpg",
    date: "2025-09-10",
    status: "active", // الحالة الافتراضية
  };

  const [isEditing, setIsEditing] = useState(false);
  const [videoData, setVideoData] = useState(mockVideo);

  const [newVideoFile, setNewVideoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [newCoverFile, setNewCoverFile] = useState(null);
  const [previewCover, setPreviewCover] = useState(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const videoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleGoBack = () => {
    setActiveTab("videos");
    router.back();
  };

  const handleDelete = () => {
    if (confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      console.log("Deleted:", videoData.id);
      router.push("/ClassRoom");
    }
  };

  const handleUpdate = () => setIsEditing(true);

  const handleSave = () => {
    console.log("Updated data:", videoData);

    if (newVideoFile) {
      simulateUpload(() => {
        setVideoData((prev) => ({
          ...prev,
          url: previewUrl,
        }));
        setNewVideoFile(null);
        setPreviewUrl(null);
      });
    }

    if (newCoverFile) {
      simulateUpload(() => {
        setVideoData((prev) => ({
          ...prev,
          thumbnail: previewCover,
        }));
        setNewCoverFile(null);
        setPreviewCover(null);
      });
    }

    if (!newVideoFile && !newCoverFile) {
      setIsEditing(false);
    }
  };

  const simulateUpload = (onComplete) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        onComplete();
        setUploadProgress(0);
        setIsEditing(false);
      }
    }, 300);
  };

  const handleCancel = () => {
    setVideoData(mockVideo);
    setNewVideoFile(null);
    setPreviewUrl(null);
    setNewCoverFile(null);
    setPreviewCover(null);
    setUploadProgress(0);
    setIsEditing(false);
  };

  useEffect(() => {
    if (newVideoFile) setPreviewUrl(URL.createObjectURL(newVideoFile));
  }, [newVideoFile]);

  useEffect(() => {
    if (newCoverFile) setPreviewCover(URL.createObjectURL(newCoverFile));
  }, [newCoverFile]);

  return (
    <div className="p-6 bg-[#1a1a1a] min-h-screen w-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-[#1998e1] flex items-center gap-2">
          <FaPlay /> {isEditing ? "تعديل الفيديو" : videoData.name}
        </h1>
        <button
          onClick={handleGoBack}
          className="bg-[#1998e1]/20 text-[#1998e1] cursor-pointer p-3 rounded-full hover:bg-[#1998e1]/30 transition"
        >
          <FaArrowLeft className="text-[#1998e1] text-md" />
        </button>
      </div>

      {/* Video + Cover */}
      <div className="w-full max-w-4xl mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* الفيديو */}
        {isEditing ? (
          <div className="flex flex-col gap-3 bg-[#222] p-4 rounded-lg">
            <label className="text-gray-300 flex items-center gap-2">
              <FaUpload /> رفع فيديو جديد (اختياري):
            </label>
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              onChange={(e) => setNewVideoFile(e.target.files[0])}
              className="hidden"
            />
            {previewUrl ? (
              <video
                controls
                className="w-full rounded-lg shadow-lg mt-3"
                src={previewUrl}
              />
            ) : (
              <div
                className="w-full h-48 flex items-center justify-center bg-[#333] rounded-lg text-gray-500 cursor-pointer"
                onClick={() => videoInputRef.current.click()}
              >
                <FaVideo size={40} />
              </div>
            )}
          </div>
        ) : (
          <video
            controls
            poster={videoData.thumbnail}
            className="w-full rounded-lg shadow-lg h-48 "
            src={videoData.url}
          />
        )}

        {/* الصورة (الغلاف) */}
        {isEditing ? (
          <div className="flex flex-col gap-3 bg-[#222] p-4 rounded-lg">
            <label className="text-gray-300 flex items-center gap-2">
              <FaUpload /> رفع صورة غلاف (اختياري):
            </label>
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              onChange={(e) => setNewCoverFile(e.target.files[0])}
              className="hidden"
            />
            {previewCover ? (
              <img
                src={previewCover}
                alt="Preview Cover"
                className="w-full h-48 object-cover rounded-lg mt-3"
              />
            ) : (
              <div
                className="w-full h-48 flex items-center justify-center bg-[#333] rounded-lg text-gray-500 cursor-pointer"
                onClick={() => coverInputRef.current.click()}
              >
                <FaImage size={40} />
              </div>
            )}
          </div>
        ) : (
          <img
            src={videoData.thumbnail}
            alt="Cover"
            className="w-full h-48 object-cover rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Progress */}
      {uploadProgress > 0 && (
        <div className="w-full max-w-4xl bg-gray-700 rounded-full h-3 mb-6">
          <div
            className="bg-[#1998e1] h-3 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Info Section */}
      <div className="w-full max-w-4xl flex flex-col gap-3">
        {isEditing ? (
          <>
            <input
              type="text"
              value={videoData.name}
              onChange={(e) =>
                setVideoData({ ...videoData, name: e.target.value })
              }
              className="bg-[#222] text-white p-2 rounded-lg"
              placeholder="اسم الفيديو"
            />
            <textarea
              value={videoData.description}
              onChange={(e) =>
                setVideoData({ ...videoData, description: e.target.value })
              }
              className="bg-[#222] text-white p-2 rounded-lg"
              placeholder="وصف الفيديو"
            />
            {/* تعديل الحالة */}
            <div className="relative w-full">
              {/* left "status" icon (non-interactive) */}
              <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1998e1] pointer-events-none" />

              {/* the select: note the extra left/right padding so text doesn't overlap icons */}
              <select
                value={videoData.status}
                onChange={(e) => setVideoData({ ...videoData, status: e.target.value })}
                className="w-full bg-[#222] text-white py-2 pl-12 pr-10 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#1998e1] transition cursor-pointer"
              >
                <option value="active">✅ نشط</option>
                <option value="pending">⏳ معلق</option>
              </select>

              {/* right dropdown indicator */}
              <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

          </>
        ) : (
          <>
            <p className="text-gray-300 text-base sm:text-lg">
              {videoData.description}
            </p>
            <div className="text-gray-400 flex items-center gap-2 text-sm sm:text-base">
              <FaCalendarAlt className="text-[#1998e1]" /> تمت الإضافة:{" "}
              {videoData.date}
            </div>
            <div
              className={`flex items-center gap-2 text-sm sm:text-base ${videoData.status === "active"
                ? "text-green-400"
                : "text-yellow-400"
                }`}
            >
              {videoData.status === "active" ? (
                <FaCheckCircle />
              ) : (
                <FaClock />
              )}
              {videoData.status === "active" ? "نشط" : "معلق"}
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="w-full max-w-4xl flex gap-4 mt-6">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              <FaSave /> حفظ
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
            >
              <FaTimes /> إلغاء
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 bg-[#1998e1] text-white px-4 py-2 rounded-lg hover:bg-[#127bbf] transition cursor-pointer"
            >
              <FaEdit /> تعديل
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
            >
              <FaTrash /> حذف
            </button>
          </>
        )}
      </div>
    </div>
  );
}
