"use client";
import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function NotesTab() {
  const [notes, setNotes] = useState(["مراجعة الواجب", "تحضير امتحان"]);
  const [newNote, setNewNote] = useState("");

  const addNote = () => {
    if (!newNote.trim()) {
      toast.error("لا يمكن إضافة ملاحظة فارغة ❌");
      return;
    }
    setNotes([...notes, newNote]);
    setNewNote("");
    toast.success("تمت إضافة الملاحظة ✅");
  };

  const deleteNote = (index) => {
    const updated = notes.filter((_, i) => i !== index);
    setNotes(updated);
    toast.success("تم حذف الملاحظة 🗑️");
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-[#1998e1] mb-4">الملاحظات</h2>

      {/* إضافة ملاحظة جديدة */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="أضف ملاحظة جديدة..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#111] border border-gray-700 text-white"
        />
        <button
          onClick={addNote}
          className="bg-green-600/20 text-green-500 p-3 rounded-lg hover:bg-green-600/30 transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* قائمة الملاحظات */}
      <ul className="space-y-3">
        {notes.map((note, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-[#111] p-3 rounded-lg border border-gray-700"
          >
            <span>{note}</span>
            <button
              onClick={() => deleteNote(index)}
              className="text-red-500 hover:text-red-600"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
