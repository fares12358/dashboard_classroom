"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaStickyNote,
  FaPaperPlane,
  FaSpinner,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "@/app/utils/api";

export default function NotesTab({ classID }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const bottomRef = useRef(null);

  // 🔹 Auto scroll when notes change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [notes]);

  // 🔹 Fetch notes on mount
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/classe/${classID}/note`);
        setNotes(res.data.notes || []);
      } catch (err) {
        console.error(err);
        toast.error("فشل تحميل الملاحظات");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [classID]);

  // 🔹 Add new note
  const addNote = async () => {
    if (!newNote.trim()) {
      toast.error(" لا يمكن إضافة ملاحظة فارغة");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/classe/${classID}/note`, {
        msg: newNote,
      });
      setNotes(res.data.notes);
      setNewNote("");
      toast.success(" تمت إضافة الملاحظة");
    } catch (err) {
      console.error(err);
      toast.error("فشل إضافة الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Delete note
  const deleteNote = async (id) => {
    setActionLoading(true);
    try {
      const res = await axios.delete(`${API_URL}/admin/classe/${classID}/note/${id}`);
      setNotes(res.data.notes);
      toast.success("🗑️ تم حذف الملاحظة");
    } catch (err) {
      console.error(err);
      toast.error("فشل حذف الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 Start editing
  const startEdit = (note) => {
    setEditId(note._id);
    setEditText(note.msg);
  };

  // 🔹 Save edit
  const saveEdit = async () => {
    if (!editText.trim()) {
      toast.error(" لا يمكن أن تكون الملاحظة فارغة");
      return;
    }
    setActionLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/admin/classe/${classID}/note/${editId}`,
        { msg: editText }
      );
      setNotes(res.data.notes);
      setEditId(null);
      setEditText("");
      toast.success(" تم تعديل الملاحظة");
    } catch (err) {
      console.error(err);
      toast.error("فشل تعديل الملاحظة");
    } finally {
      setActionLoading(false);
    }
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
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-[#1998e1] text-3xl" />
          </div>
        ) : (
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note._id}
                className="flex justify-end"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="bg-[#1998e1]/20 text-white p-4 rounded-2xl shadow-md flex flex-col max-w-full break-words">
                  {editId === note._id ? (
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
                          disabled={actionLoading}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaSave />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="mb-2 flex items-start gap-2 whitespace-pre-wrap break-words">
                        <FaStickyNote className="text-[#1998e1] shrink-0" />
                        <span className="break-words">{note.msg}</span>
                      </span>
                      <span className="text-xs text-gray-400 mb-2">
                        {new Date(note.createdAt).toLocaleString("ar-EG")}
                      </span>
                      <div className="flex gap-3 self-end text-sm text-gray-300">
                        <button
                          onClick={() => startEdit(note)}
                          className="text-yellow-400 cursor-pointer"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => deleteNote(note._id)}
                          disabled={actionLoading}
                          className="text-red-500 cursor-pointer disabled:opacity-50"
                        >
                          {actionLoading ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
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
          disabled={actionLoading}
          className="bg-[#1998e1]/20 text-[#1998e1] p-3 rounded-lg hover:bg-[#1998e1]/30 transition cursor-pointer disabled:opacity-50"
        >
          {actionLoading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaPaperPlane />
          )}
        </button>
      </div>
    </div>
  );
}
