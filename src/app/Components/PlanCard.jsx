"use client";
import React, { useState } from "react";
import {
  FaCalendarAlt, FaMoneyBillWave, FaInfoCircle,
  FaTrash, FaEdit, FaSave, FaUndo, FaSpinner, FaExclamationTriangle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import { motion, AnimatePresence } from "framer-motion";

const DURATION_OPTIONS = [
  { value: "day", label: "يوم" },
  { value: "week", label: "أسبوع" },
  { value: "month", label: "شهر" },
  { value: "year", label: "سنة" },
];

export default function PlanCard({ title, duration, price, description, id, onDeleted, onUpdated }) {
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [planData, setPlanData] = useState({
    title,
    price,
    durationValue: duration?.split(" ")[0] ?? "",
    durationType: duration?.split(" ")[1] ?? "month",
    description: description || "",
  });

  const handleSave = async () => {
    if (!planData.title || !planData.price || !planData.durationValue || !planData.durationType) {
      toast.error("جميع الحقول مطلوبة"); return;
    }
    setSaving(true);
    try {
      await axios.put(`${API_URL}/plans/${id}`,
        { title: planData.title, price: Number(planData.price), durationValue: Number(planData.durationValue), durationType: planData.durationType, description: planData.description },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      toast.success("تم تحديث الخطة");
      setEditMode(false);
      if (onUpdated) onUpdated();
    } catch (err) {
      toast.error(err.response?.data?.message || "خطأ أثناء تحديث الخطة");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/plans/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
      toast.success("تم حذف الخطة");
      if (onDeleted) onDeleted(id);
    } catch (err) {
      toast.error(err.response?.data?.message || "خطأ أثناء حذف الخطة");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="card"
      style={{ padding: "1.2rem", display: "flex", flexDirection: "column", gap: "0.75rem", position: "relative" }}
    >
      {/* Action row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "var(--blue)", fontSize: "1rem" }}>
          {editMode
            ? <input className="input" style={{ fontWeight: 700, fontSize: "0.95rem" }} value={planData.title} onChange={e => setPlanData({ ...planData, title: e.target.value })} disabled={saving} />
            : planData.title
          }
        </span>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {editMode ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn btn-success btn-sm btn-icon">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
              </button>
              <button onClick={() => setEditMode(false)} disabled={saving} className="btn btn-ghost btn-sm btn-icon">
                <FaUndo />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditMode(true)} className="btn btn-ghost btn-sm btn-icon">
                <FaEdit style={{ color: "var(--blue)", fontSize: "0.8rem" }} />
              </button>
              <button onClick={() => setConfirmDelete(true)} disabled={deleting} className="btn btn-danger btn-sm btn-icon">
                {deleting ? <FaSpinner className="animate-spin" style={{ fontSize: "0.8rem" }} /> : <FaTrash style={{ fontSize: "0.8rem" }} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <FaMoneyBillWave style={{ color: "var(--green)" }} />
        {editMode
          ? <input className="input" type="number" style={{ width: 100 }} value={planData.price} onChange={e => setPlanData({ ...planData, price: e.target.value })} disabled={saving} />
          : <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--green)" }}>{planData.price}</span>
        }
      </div>

      {/* Duration */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.85rem" }}>
        <FaCalendarAlt style={{ color: "var(--blue)" }} />
        {editMode ? (
          <div style={{ display: "flex", gap: 6 }}>
            <input className="input" type="number" style={{ width: 70 }} value={planData.durationValue} onChange={e => setPlanData({ ...planData, durationValue: e.target.value })} disabled={saving} />
            <select className="input" style={{ width: 100 }} value={planData.durationType} onChange={e => setPlanData({ ...planData, durationType: e.target.value })} disabled={saving}>
              {DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        ) : (
          <span>{planData.durationValue} {planData.durationType}</span>
        )}
      </div>

      {/* Description */}
      {editMode ? (
        <textarea className="input" rows={2} style={{ resize: "vertical" }} value={planData.description} onChange={e => setPlanData({ ...planData, description: e.target.value })} disabled={saving} placeholder="الوصف" />
      ) : planData.description ? (
        <div style={{ display: "flex", gap: 6, color: "var(--text-muted)", fontSize: "0.82rem" }}>
          <FaInfoCircle style={{ color: "var(--blue)", marginTop: 2, flexShrink: 0 }} />
          <span>{planData.description}</span>
        </div>
      ) : null}

      {/* Confirm delete overlay */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
          >
            <div style={{ textAlign: "center", padding: "1.25rem" }}>
              <FaExclamationTriangle style={{ color: "var(--red)", fontSize: "2rem", marginBottom: "0.6rem" }} />
              <div style={{ fontWeight: 700, color: "var(--text-main)", marginBottom: "1rem", fontSize: "0.9rem" }}>
                هل أنت متأكد من حذف هذه الخطة؟
              </div>
              <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center" }}>
                <button onClick={handleDelete} disabled={deleting} className="btn btn-danger btn-sm">
                  {deleting ? <FaSpinner className="animate-spin" /> : "حذف"}
                </button>
                <button onClick={() => setConfirmDelete(false)} disabled={deleting} className="btn btn-ghost btn-sm">إلغاء</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
