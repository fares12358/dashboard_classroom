"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDeferredEffect } from "@/app/utils/useDeferredEffect";
import {
  FaTrash, FaEdit, FaSave, FaTimes, FaStickyNote,
  FaPaperPlane, FaSpinner, FaSyncAlt,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";

export default function NotesTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [newNote, setNewNote] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const bottomRef = useRef(null);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { if (classID) openClass(classID); }, [classID]);

  const notesClass = getClassData(classID)?.notes;

  const fetchNotes = async (force = false) => {
    if (!classID) return;
    if (Array.isArray(notesClass) && !force) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/note`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClassTabData(classID, "notes", res.data.notes || []);
    } catch {
      toast.error("فشل تحميل الملاحظات");
    } finally {
      setLoading(false);
    }
  };

  useDeferredEffect(() => { fetchNotes(); }, [classID]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [notesClass]);

  const addNote = async () => {
    if (!newNote.trim()) return toast.error("لا يمكن إضافة ملاحظة فارغة");
    setActionLoading(true);
    try {
      await axios.post(`${API_URL}/admin/classe/${classID}/note`, { msg: newNote }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNewNote("");
      fetchNotes(true);
      toast.success("تمت إضافة الملاحظة");
    } catch {
      toast.error("فشل إضافة الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteNote = async (id) => {
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/classe/${classID}/note/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      fetchNotes(true);
      toast.success("تم حذف الملاحظة");
    } catch {
      toast.error("فشل حذف الملاحظة");
    } finally {
      setDeleteLoading(false);
      setConfirmDeleteId(null);
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return toast.error("لا يمكن أن تكون الملاحظة فارغة");
    setActionLoading(true);
    try {
      await axios.put(`${API_URL}/admin/classe/${classID}/note/${editId}`, { msg: editText }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setEditId(null); setEditText("");
      fetchNotes(true);
      toast.success("تم تعديل الملاحظة");
    } catch {
      toast.error("فشل تعديل الملاحظة");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 180px)", maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <FaStickyNote style={{ color: "var(--blue)" }} /> الملاحظات
          <span className="badge badge-blue">{notesClass?.length ?? 0}</span>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => fetchNotes(true)} disabled={loading} className="btn btn-ghost btn-sm">
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
        </motion.button>
      </div>

      {/* Notes scroll area */}
      <div className="hide-scroll" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.6rem", padding: "0.25rem" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <FaSpinner className="animate-spin" style={{ fontSize: "2rem", color: "var(--blue)" }} />
          </div>
        )}

        {!loading && notesClass?.length === 0 && (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0", fontSize: "0.9rem" }}>
            لا توجد ملاحظات بعد — ابدأ بإضافة ملاحظة أدناه
          </div>
        )}

        <AnimatePresence>
          {notesClass?.map(note => (
            <motion.div
              key={note._id}
              style={{ display: "flex", justifyContent: "flex-end" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{
                background: "var(--blue-dim)",
                border: "1px solid var(--border-blue)",
                borderRadius: "14px 4px 14px 14px",
                padding: "0.75rem 1rem",
                maxWidth: "80%",
                wordBreak: "break-word",
              }}>
                {editId === note._id ? (
                  <>
                    <input
                      className="input"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ marginBottom: "0.5rem" }}
                      onKeyDown={e => e.key === "Enter" && saveEdit()}
                    />
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                      <button onClick={saveEdit} disabled={actionLoading} className="btn btn-success btn-sm">
                        {actionLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                      </button>
                      <button onClick={() => { setEditId(null); setEditText(""); }} className="btn btn-ghost btn-sm"><FaTimes /></button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.7, marginBottom: "0.35rem" }}>{note.msg}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-dim)" }}>
                        {new Date(note.createdAt).toLocaleString("ar-EG")}
                      </span>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => { setEditId(note._id); setEditText(note.msg); }} className="btn btn-ghost btn-sm btn-icon" style={{ padding: "2px 5px" }}>
                          <FaEdit style={{ fontSize: "0.7rem", color: "var(--yellow)" }} />
                        </button>
                        <button onClick={() => setConfirmDeleteId(note._id)} className="btn btn-danger btn-sm btn-icon" style={{ padding: "2px 5px" }}>
                          <FaTrash style={{ fontSize: "0.7rem" }} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{ flexShrink: 0, paddingTop: "0.85rem", display: "flex", gap: "0.6rem", borderTop: "1px solid var(--border)", marginTop: "0.75rem" }}>
        <input
          className="input"
          style={{ flex: 1 }}
          placeholder="أضف ملاحظة جديدة..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !actionLoading && addNote()}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={addNote} disabled={actionLoading} className="btn btn-primary btn-icon">
          {actionLoading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
        </motion.button>
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDeleteId && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
              <div style={{ fontWeight: 700, color: "var(--red)", marginBottom: "0.75rem" }}>تأكيد الحذف</div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>
                هل أنت متأكد أنك تريد حذف هذه الملاحظة؟
              </p>
              <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end" }}>
                <button onClick={() => setConfirmDeleteId(null)} className="btn btn-ghost btn-sm">إلغاء</button>
                <button onClick={() => deleteNote(confirmDeleteId)} disabled={deleteLoading} className="btn btn-danger btn-sm">
                  {deleteLoading ? <FaSpinner className="animate-spin" /> : "حذف"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
