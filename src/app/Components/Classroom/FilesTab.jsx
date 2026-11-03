"use client";
import React, { useEffect, useState } from "react";
import { useDeferredEffect } from "@/app/utils/useDeferredEffect";
import axios from "axios";
import {
  FaTrash, FaFilePdf, FaPlus, FaSpinner, FaFileAlt,
  FaEdit, FaSave, FaTimes, FaExclamationTriangle, FaSyncAlt,
} from "react-icons/fa";
import { API_URL } from "@/app/utils/api";
import { useAppContext } from "@/app/Context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function FilesTab({ classID }) {
  const { getClassData, setClassTabData, openClass } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => { if (classID) openClass(classID); }, [classID]);

  const pdfsClass = getClassData(classID)?.files;

  const fetchFiles = async (force = false) => {
    if (!classID) return;
    if (Array.isArray(pdfsClass) && !force) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/classe/${classID}/Allfiles`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setClassTabData(classID, "files", res.data.pdfs || []);
    } catch {
      toast.error("فشل تحميل الملفات");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("اختر ملف PDF");
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("name", name);
    formData.append("description", description);
    try {
      setLoading(true);
      await axios.post(`${API_URL}/admin/classe/${classID}/file`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
      });
      await fetchFiles(true);
      setFile(null); setName(""); setDescription("");
      toast.success("تم رفع الملف");
    } catch {
      toast.error("فشل رفع الملف");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/admin/classe/${classID}/file/${confirmDelete}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      await fetchFiles(true);
      toast.success("تم حذف الملف");
    } catch {
      toast.error("فشل حذف الملف");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const handleUpdate = async (e, pdfId) => {
    e.preventDefault();
    const formData = new FormData();
    if (editFile) formData.append("pdf", editFile);
    formData.append("name", editName);
    formData.append("description", editDescription);
    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/classe/${classID}/file/${pdfId}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${getToken()}` },
      });
      await fetchFiles(true);
      setEditId(null);
      toast.success("تم تحديث الملف");
    } catch {
      toast.error("فشل تحديث الملف");
    } finally {
      setLoading(false);
    }
  };

  useDeferredEffect(() => { fetchFiles(); }, [classID]);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: 8 }}>
          <FaFilePdf style={{ color: "var(--red)" }} /> ملفات PDF
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={() => fetchFiles(true)} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          <span className="hidden md:inline">تحديث</span>
        </motion.button>
      </div>

      {/* Upload form */}
      <motion.form
        onSubmit={handleUpload}
        className="card"
        style={{ padding: "1.25rem", marginBottom: "1.25rem" }}
        initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      >
        <div style={{ fontWeight: 600, color: "var(--blue)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
          <FaPlus style={{ fontSize: "0.8rem" }} /> رفع ملف جديد
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          <input className="input" placeholder="اسم الملف" value={name} onChange={e => setName(e.target.value)} />
          <input className="input" placeholder="الوصف" value={description} onChange={e => setDescription(e.target.value)} />
          <label className="drop-zone">
            <FaFilePdf style={{ fontSize: "1.5rem", color: "var(--red)" }} />
            <span>{file ? file.name : "اختر ملف PDF"}</span>
            <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: "0.85rem" }}>
          {loading ? <FaSpinner className="animate-spin" /> : <FaPlus />} رفع ملف
        </button>
      </motion.form>

      {/* Files grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "0.85rem" }}>
        <AnimatePresence>
          {pdfsClass?.length > 0 ? pdfsClass.map(pdf => (
            <motion.div
              key={pdf._id}
              className="card card-hover"
              style={{ padding: "1rem" }}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
            >
              {editId === pdf._id ? (
                <form onSubmit={e => handleUpdate(e, pdf._id)} style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
                  <input className="input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="اسم الملف" />
                  <input className="input" value={editDescription} onChange={e => setEditDescription(e.target.value)} placeholder="الوصف" />
                  <label className="drop-zone" style={{ minHeight: 60 }}>
                    <FaFilePdf style={{ color: "var(--yellow)" }} />
                    <span style={{ fontSize: "0.78rem" }}>{editFile ? editFile.name : "ملف PDF جديد (اختياري)"}</span>
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
                    <div style={{ display: "flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: "0.9rem", flex: 1, minWidth: 0 }}>
                      <FaFileAlt style={{ color: "var(--blue)", flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pdf.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                      <button className="btn btn-ghost btn-sm btn-icon" onClick={() => { setEditId(pdf._id); setEditName(pdf.name); setEditDescription(pdf.description || ""); setEditFile(null); }}>
                        <FaEdit style={{ fontSize: "0.75rem", color: "var(--yellow)" }} />
                      </button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => setConfirmDelete(pdf._id)}>
                        <FaTrash style={{ fontSize: "0.75rem" }} />
                      </button>
                    </div>
                  </div>
                  {pdf.description && <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>{pdf.description}</p>}
                  <div style={{ fontSize: "0.75rem", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
                    {pdf.addedAt ? new Date(pdf.addedAt).toLocaleDateString("ar-EG") : ""}
                  </div>
                  {pdf.url && (
                    <a href={pdf.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }}>
                      <FaFilePdf style={{ color: "var(--red)" }} /> عرض الملف
                    </a>
                  )}
                </>
              )}
            </motion.div>
          )) : (
            !loading && <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>لا توجد ملفات بعد</div>
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
                <div style={{ fontWeight: 700, marginBottom: "0.5rem" }}>هل أنت متأكد من حذف الملف؟</div>
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
