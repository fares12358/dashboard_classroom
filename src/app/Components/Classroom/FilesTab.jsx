"use client";
import React, { useState } from "react";
import { FaSearch, FaFolderOpen, FaExclamationTriangle } from "react-icons/fa";
import AddFileSection from "./Files/AddFileSection";
import FileCard from "./Files/FileCard";

export default function FilesTab() {
  const [files, setFiles] = useState([
    {
      name: "React Guide",
      description: "ملف PDF يشرح React",
      url: "/docs/react-guide.pdf",
      date: "2025-09-10",
    },
  ]);

  const [search, setSearch] = useState("");

  const handleAddFile = (file) => {
    setFiles([...files, file]);
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-6">
      {/* العنوان */}
      <h2 className="text-2xl font-bold text-[#1998e1] flex items-center gap-2">
        <FaFolderOpen className="text-[#1998e1]" /> الملفات
      </h2>

      {/* شريط البحث */}
      <div className="relative w-full md:w-1/2">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="ابحث عن ملف بالاسم..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#111] text-white outline-none border border-gray-700 focus:border-[#1998e1] transition"
        />
      </div>

      {/* قسم إضافة الملف */}
      <AddFileSection onAdd={handleAddFile} />

      {/* عرض الملفات */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file, index) => (
            <FileCard key={index} file={file} />
          ))
        ) : (
          <p className="text-gray-400 flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            لا يوجد ملفات مطابقة للبحث.
          </p>
        )}
      </div>
    </div>
  );
}
