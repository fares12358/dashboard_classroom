"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaStickyNote,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function NotesTab() {
  const [notes, setNotes] = useState([
    { id: 1, text: "مراجعة الواجب", date: "2025-09-10 10:30" },
    {
      id: 2,
      text: "تحضير امتحان طويل جدًا يحتوي على تفاصيل كثيرة جدًا لكي نختبر خاصية التفاف النص داخل الفقاعة",
      date: "2025-09-10 12:15",
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const bottomRef = useRef(null);

  // 🔹 Auto scroll when notes change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

  const addNote = () => {
    if (!newNote.trim()) {
      toast.error(" لا يمكن إضافة ملاحظة فارغة");
      return;
    }
    const note = {
      id: Date.now(),
      text: newNote,
      date: new Date().toLocaleString("ar-EG"),
    };
    setNotes([...notes, note]);
    setNewNote("");
    toast.success(" تمت إضافة الملاحظة");
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast.success("🗑️ تم حذف الملاحظة");
  };

  const startEdit = (note) => {
    setEditId(note.id);
    setEditText(note.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      toast.error(" لا يمكن أن تكون الملاحظة فارغة");
      return;
    }
    setNotes(
      notes.map((note) =>
        note.id === editId ? { ...note, text: editText } : note
      )
    );
    setEditId(null);
    setEditText("");
    toast.success(" تم تعديل الملاحظة");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col h-[80vh]">
      <h2 className="text-2xl font-bold text-[#1998e1] mb-4 flex items-center gap-2">
        <FaStickyNote /> الملاحظات
      </h2>

      {/* منطقة عرض الملاحظات */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2 hidde_scroll">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note.id}
              className="flex justify-end"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="bg-[#1998e1]/20 text-white p-4 rounded-2xl shadow-md flex flex-col max-w-full break-words">
                {editId === note.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="p-2 rounded-md bg-[#111] text-white outline-none mb-2"
                    />
                    <div className="flex gap-2 self-end">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition"
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="mb-2 flex items-start gap-2 whitespace-pre-wrap break-words">
                      <FaStickyNote className="text-[#1998e1] shrink-0" />
                      <span className="break-words">{note.text}</span>
                    </span>
                    <span className="text-xs text-gray-400 mb-2">
                      {note.date}
                    </span>
                    <div className="flex gap-3 self-end text-sm text-gray-300">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-yellow-400 cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef}></div>
      </div>

      {/* إدخال ملاحظة جديدة */}
      <div className="flex gap-2 mt-4">
        <input
          type="text"
          placeholder="✍️ أضف ملاحظة جديدة..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="flex-1 p-3 rounded-lg bg-[#111] focus:border-[#1998e1] focus:outline-none border border-gray-700 text-white transition-all ease-in-out duration-300"
        />
        <button
          onClick={addNote}
          className="bg-[#1998e1]/20 text-[#1998e1] p-3 rounded-lg hover:bg-[#1998e1]/30 transition cursor-pointer"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
