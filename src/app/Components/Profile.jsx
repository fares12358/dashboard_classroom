"use client";
import React, { useState } from "react";
import {
  FaUser, FaEnvelope, FaPhone, FaIdBadge, FaEdit, FaSave,
  FaUndo, FaLock, FaSpinner, FaSyncAlt, FaCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

function Field({ icon: Icon, label, name, value, editValue, onChange, editing, type = "text", children }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 6 }}>
        <Icon style={{ color: "var(--blue)", fontSize: "0.8rem" }} /> {label}
      </label>
      {editing && name ? (
        children || (
          <input className="input" type={type} value={editValue ?? ""} onChange={e => onChange(e.target.value)} />
        )
      ) : (
        <div style={{ fontSize: "0.95rem", color: "var(--text-main)", padding: "0.4rem 0" }}>{value || "—"}</div>
      )}
    </div>
  );
}

export default function Profile() {
  const { user, setUser } = useAppContext();
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const startEditing = () => {
    setDraft({ name: user.name, phone: user.phone || "", role: user.role, status: user.status });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(null);
    setPasswords({ newPassword: "" });
  };

  const handleSave = async () => {
    if (!user || !draft) return;
    setSaving(true);
    try {
      const payload = { name: draft.name, phone: draft.phone, email: user.email, role: draft.role, status: draft.status };
      if (passwords.newPassword) payload.password = passwords.newPassword;
      const res = await axios.put(`${API_URL}/admin/auth/${user._id}`, payload, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const updated = res.data.admin || res.data.newadmin || res.data;
      setUser({ ...user, ...updated });
      cancelEditing();
      toast.success("تم تحديث البيانات");
    } catch {
      toast.error("فشل التحديث");
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    if (!user?._id) return;
    setRefreshing(true);
    try {
      const res = await axios.get(`${API_URL}/admin/auth/${user._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setUser(res.data.admin);
      toast.success("تم التحديث");
    } catch {
      toast.error("فشل في تحديث البيانات");
    } finally {
      setRefreshing(false);
    }
  };

  if (!user) return (
    <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "4rem" }}>لا توجد بيانات</div>
  );


  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div className="section-title">الملف الشخصي</div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={handleRefresh} disabled={refreshing} className="btn btn-ghost btn-sm">
          {refreshing ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
        </motion.button>
      </div>

      <div className="card" style={{ padding: "1.75rem", maxWidth: 560 }}>
        {/* Avatar row */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border)" }}>
          <div style={{
            width: 54, height: 54, borderRadius: "50%",
            background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--blue)", fontSize: "1.4rem",
          }}>
            <FaUser />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{user.name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span className={`badge ${user.status === "active" ? "badge-green" : "badge-red"}`}>
                <FaCircle style={{ fontSize: "0.5rem" }} />
                {user.status === "active" ? "نشط" : "غير نشط"}
              </span>
              <span className="badge badge-blue">{user.role === "super-admin" ? "سوبر مدير" : "مدير"}</span>
            </div>
          </div>
        </div>

        <Field editing={editing} icon={FaUser} label="الاسم" name="name"
          value={user.name} editValue={draft?.name}
          onChange={v => setDraft({ ...draft, name: v })} />

        <Field editing={editing} icon={FaEnvelope} label="البريد الإلكتروني" value={user.email} />

        <Field editing={editing} icon={FaPhone} label="الهاتف" name="phone"
          value={user.phone || "—"} editValue={draft?.phone}
          onChange={v => setDraft({ ...draft, phone: v })} />

        <Field editing={editing} icon={FaIdBadge} label="الدور" name="role"
          value={user.role === "super-admin" ? "سوبر مدير" : "مدير"}
          editValue={draft?.role} onChange={() => {}}>
          {editing && (
            <select className="input" value={draft?.role} onChange={e => setDraft({ ...draft, role: e.target.value })}>
              <option value="admin">مدير</option>
              <option value="super-admin">سوبر مدير</option>
            </select>
          )}
        </Field>

        <Field editing={editing} icon={FaCircle} label="الحالة" name="status"
          value={user.status === "active" ? "نشط" : "غير نشط"}
          editValue={draft?.status} onChange={() => {}}>
          {editing && (
            <select className="input" value={draft?.status} onChange={e => setDraft({ ...draft, status: e.target.value })}>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          )}
        </Field>

        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <hr className="divider" />
              <Field editing={editing} icon={FaLock} label="كلمة المرور الجديدة (اختياري)" name="pass"
                value="" editValue={passwords.newPassword}
                onChange={v => setPasswords({ newPassword: v })} type="password" />
            </motion.div>
          )}
        </AnimatePresence>

        <hr className="divider" />
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saving} className="btn btn-success">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? "جاري الحفظ..." : "حفظ"}
              </button>
              <button onClick={cancelEditing} className="btn btn-ghost">
                <FaUndo /> إلغاء
              </button>
            </>
          ) : (
            <button onClick={startEditing} className="btn btn-primary">
              <FaEdit /> تعديل البيانات
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
