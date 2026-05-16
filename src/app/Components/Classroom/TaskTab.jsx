"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaTrash, FaPlus, FaSpinner, FaEdit, FaSave, FaTimes,
  FaExclamationTriangle, FaTasks, FaClipboardList, FaFilePdf, FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { if (classID) openClass(classID); }, [classID]);

  const tasksClass = getClassData(classID)?.tasks;

  const fetchTasks = async (force = false) => {
    if (!classID) return;
    if (Array.isArray(tasksClass) && !force) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/class/${classID}/tasks`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClassTabData(classID, "tasks", res.data.tasks || []);
    } catch {
      toast.error("فشل جلب المهام");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [classID]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("يجب كتابة عنوان المهمة");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (file) formData.append("task", file);
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/class/${classID}/task`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
      });
      await fetchTasks(true);
      toast.success("تمت إضافة المهمة بنجاح");
      setName(""); setDescription(""); setFile(null);
    } catch {
      toast.error("فشل إضافة المهمة");
    } finally {
      setLoading(false);
    }
  };

  const saveEdit = async (e, taskId) => {
    e.preventDefault();
    if (!editName.trim()) return toast.error("يجب كتابة عنوان المهمة");
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    if (editFile) formData.append("task", editFile);
    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/class/${classID}/task/${taskId}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
      });
      toast.success("تم تحديث المهمة");
      setEditId(null);
      fetchTasks(true);
    } catch {
      toast.error("فشل تحديث المهمة");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/admin/class/${classID}/task/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("تم حذف المهمة");
      fetchTasks(true);
    } catch {
      toast.error("فشل حذف المهمة");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <FaTasks style={{ color: "var(--blue)" }} /> المهام والاختبارات
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => fetchTasks(true)} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* Add form */}
      <motion.form
        onSubmit={handleAddTask}
        className="card"
        style={{ padding: "1.25rem", marginBottom: "1.25rem" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontWeight: 600, color: "var(--blue)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus style={{ fontSize: "0.8rem" }} /> إضافة مهمة جديدة
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <input className="input" placeholder="عنوان المهمة *" value={name} onChange={e => setName(e.target.value)} />
          <textarea className="input" placeholder="الوصف" rows={3} style={{ resize: "vertical" }} value={description} onChange={e => setDescription(e.target.value)} />
          <label className="drop-zone">
            <FaFilePdf style={{ fontSize: "1.5rem", color: "var(--red)" }} />
            <span>{file ? file.name : "اختر ملف PDF (اختياري)"}</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "0.85rem" }}>
          {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
          إضافة مهمة
        </button>
      </motion.form>

      {/* Loading */}
      {loading && !tasksClass && (
        <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
          <FaSpinner className="animate-spin" style={{ fontSize: "2rem", color: "var(--blue)" }} />
        </div>
      )}

      {/* Tasks grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "0.85rem" }}>
        <AnimatePresence>
          {tasksClass?.length > 0 ? tasksClass.map(task => (
            <motion.div
              key={task._id}
              className="card card-hover"
              style={{ padding: "1rem" }}
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              {editId === task._id ? (
                <form onSubmit={e => saveEdit(e, task._id)} style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <input className="input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="العنوان" />
                  <textarea className="input" rows={2} style={{ resize: "vertical" }} value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="الوصف" />
                  <label className="drop-zone" style={{ minHeight: 60 }}>
                    <FaFilePdf style={{ color: "var(--yellow)" }} />
                    <span style={{ fontSize: "0.78rem" }}>{editFile ? editFile.name : "ملف جديد (اختياري)"}</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={e => setEditFile(e.target.files[0])} />
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button type="submit" className="btn btn-success btn-sm"><FaSave /> حفظ</button>
                    <button type="button" onClick={() => setEditId(null)} className="btn btn-ghost btn-sm"><FaTimes /></button>
                  </div>
                </form>
              ) : (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: "0.92rem", flex: 1, minWidth: 0 }}>
                      <FaClipboardList style={{ color: "var(--blue)", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditId(task._id); setEditName(task.name); setEditDescription(task.description || ""); setEditFile(null); }}>
                        <FaEdit style={{ fontSize: "0.75rem", color: "var(--yellow)" }} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDelete(task._id)}>
                        <FaTrash style={{ fontSize: "0.75rem" }} />
                      </button>
                    </div>
                  </div>
                  {task.description && <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.5rem", lineHeight: 1.6 }}>{task.description}</p>}
                  {task.url && (
                    <a href={task.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ marginBottom: "0.4rem" }}>
                      <FaFilePdf style={{ color: "var(--red)" }} /> عرض الملف
                    </a>
                  )}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    {task.addedAt ? new Date(task.addedAt).toLocaleDateString("ar-EG") : ""}
                  </div>
                </>
              )}
            </motion.div>
          )) : (
            !loading && <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>لا توجد مهام بعد</div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="modal-box" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}>
              <div style={{ textAlign: "center" }}>
                <FaExclamationTriangle style={{ color: "var(--red)", fontSize: "2.5rem", marginBottom: "0.75rem" }} />
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>هل أنت متأكد من حذف المهمة؟</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.25rem" }}>لا يمكن التراجع بعد الحذف.</div>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={confirmDeleteAction} disabled={deleting} className="btn btn-danger">
                    {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash />} حذف
                  </button>
                  <button onClick={() => setConfirmDelete(null)} className="btn btn-ghost"><FaTimes /> إلغاء</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
