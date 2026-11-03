"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDeferredEffect } from "@/app/utils/useDeferredEffect";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaCalendarAlt, FaMoneyBillWave, FaLink, FaHourglass,
  FaUser, FaEnvelope, FaPhone, FaSync, FaSpinner, FaUserClock,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../Context/AppContext";
import { API_URL } from "../utils/api";

const formatTimeLeft = (ms) => {
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 3600)}س ${Math.floor((s % 3600) / 60)}د ${s % 60}ث`;
};

export default function PendingUsers() {
  const { pendingUsers, setpendingUsers } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [sending, setSending] = useState({});

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const initTimers = (users) => {
    const timers = {};
    users.forEach(u => {
      if (u.expireAt) timers[u.id] = new Date(u.expireAt).getTime() - Date.now();
    });
    setTimeLeft(timers);
  };

  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/admin/pendingUsers`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.data.success) {
        setpendingUsers(res.data.data);
        initTimers(res.data.data);
      } else toast.error(res.data.message || "فشل في جلب المستخدمين");
    } catch {
      toast.error("حدث خطأ أثناء جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  }, []);

  useDeferredEffect(() => {
    if (pendingUsers === null) fetchPendingUsers();
    else initTimers(pendingUsers || []);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const updated = {};
        Object.keys(prev).forEach(id => {
          const t = prev[id] - 1000;
          if (t > 0) updated[id] = t;
          else setpendingUsers(u => (u || []).filter(x => String(x.id) !== String(id)));
        });
        return updated;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleResendLink = async (user, remaining) => {
    if (!user.email || !user.checkoutUrl || !remaining) { toast.error("بيانات غير كافية"); return; }
    setSending(p => ({ ...p, [user.id]: true }));
    try {
      const res = await axios.post(
        `${API_URL}/admin/resend-payment-link`,
        { email: user.email, url: user.checkoutUrl, time: remaining },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res.data.success) toast.success("تم إرسال رابط الدفع");
      else toast.error(res.data.message || "فشل الإرسال");
    } catch {
      toast.error("حدث خطأ أثناء إرسال الرابط");
    } finally {
      setSending(p => ({ ...p, [user.id]: false }));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-title">الحسابات المعلقة</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>
            {pendingUsers?.length ?? 0} مستخدم ينتظر الدفع
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={fetchPendingUsers} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          <span>تحديث</span>
        </motion.button>
      </div>

      {/* Loading skeleton */}
      {loading && !pendingUsers?.length && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1rem" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card" style={{ padding: "1.2rem", height: 200 }} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && pendingUsers?.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaUserClock style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا يوجد مستخدمين معلقين حالياً</div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "1rem" }}>
        <AnimatePresence>
          {pendingUsers?.map((user) => {
            const msLeft    = timeLeft[user.id] || 0;
            const remaining = formatTimeLeft(msLeft);

            return (
              <motion.div
                key={user.id}
                className="card"
                style={{ padding: "1.2rem" }}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                {/* User info */}
                <div style={{ marginBottom: "0.85rem", paddingBottom: "0.85rem", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", gap: 6 }}>
                      <FaUser style={{ color: "var(--blue)", fontSize: "0.8rem" }} /> {user.name}
                    </div>
                    {remaining ? (
                      <span className="badge badge-yellow">
                        <FaHourglass style={{ fontSize: "0.65rem" }} /> {remaining}
                      </span>
                    ) : (
                      <span className="badge badge-red">منتهية</span>
                    )}
                  </div>
                  <div style={{ marginTop: 6, fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 3 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FaEnvelope style={{ color: "var(--blue)", fontSize: "0.7rem" }} /> {user.email}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <FaPhone style={{ color: "var(--blue)", fontSize: "0.7rem" }} /> {user.phone}
                    </span>
                  </div>
                </div>

                {/* Plan */}
                {user.plan && (
                  <div style={{ background: "var(--bg-panel)", borderRadius: 10, padding: "0.65rem 0.85rem", marginBottom: "0.6rem", fontSize: "0.82rem" }}>
                    <div style={{ color: "var(--blue)", fontWeight: 700, marginBottom: 3 }}>الخطة</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)" }}>
                      <FaMoneyBillWave style={{ color: "var(--blue)" }} />
                      {user.plan.title} — ${user.plan.price} / {user.plan.durationValue} {user.plan.durationType}
                    </div>
                  </div>
                )}

                {/* Transaction */}
                {user.transaction && (
                  <div style={{ background: "var(--bg-panel)", borderRadius: 10, padding: "0.65rem 0.85rem", marginBottom: "0.6rem", fontSize: "0.82rem" }}>
                    <div style={{ color: "var(--blue)", fontWeight: 700, marginBottom: 3 }}>المعاملة</div>
                    <div style={{ color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 2 }}>
                      <span>المبلغ: <strong style={{ color: "var(--green)" }}>${user.transaction.amount} {user.transaction.currency?.toUpperCase()}</strong></span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <FaCalendarAlt style={{ color: "var(--blue)", fontSize: "0.7rem" }} />
                        {new Date(user.transaction.createdAt).toLocaleDateString("ar-EG")}
                      </span>
                    </div>
                    {user.transaction.checkoutUrl && (
                      <a href={user.transaction.checkoutUrl} target="_blank" rel="noreferrer"
                        className="btn btn-ghost btn-sm" style={{ marginTop: 6, fontSize: "0.78rem" }}>
                        <FaLink /> رابط الدفع
                      </a>
                    )}
                  </div>
                )}

                {/* Resend */}
                <button
                  onClick={() => handleResendLink(user, remaining)}
                  disabled={sending[user.id] || !remaining}
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
                >
                  {sending[user.id] ? <FaSpinner className="animate-spin" /> : <SiGmail />}
                  {sending[user.id] ? "جاري الإرسال..." : "إعادة إرسال الرابط"}
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
