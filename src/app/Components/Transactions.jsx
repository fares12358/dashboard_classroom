"use client";
import React, { useEffect, useState } from "react";
import {
  FaUser, FaDollarSign, FaCalendarAlt, FaLink, FaSpinner, FaSync,
  FaCheckCircle, FaHourglass,
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api.js";
import { useAppContext } from "../Context/AppContext.jsx";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_MAP = {
  succeeded: { label: "ناجحة",  cls: "badge-green" },
  pending:   { label: "معلقة",  cls: "badge-yellow" },
  failed:    { label: "فاشلة",  cls: "badge-red" },
};

export default function Transactions() {
  const { transactions, setTransactions } = useAppContext();
  const [loading, setLoading] = useState(false);

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/transactions`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.data.success) setTransactions(res.data.data);
      else toast.error("فشل في جلب المعاملات");
    } catch {
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (!transactions) fetchTransactions(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-title">المعاملات المالية</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{transactions?.length ?? 0} معاملة</div>
        </div>
        <motion.button whileTap={{ scale: 0.92 }} onClick={fetchTransactions} disabled={loading} className="btn btn-ghost btn-sm">
          {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          <span>تحديث</span>
        </motion.button>
      </div>

      {/* Loading skeleton */}
      {loading && !transactions && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card" style={{ padding: "1rem", height: 80 }}>
              <div style={{ height: 12, background: "var(--bg-card-2)", borderRadius: 5, width: "30%", marginBottom: 8 }} />
              <div style={{ height: 10, background: "var(--bg-card-2)", borderRadius: 5, width: "50%" }} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && transactions?.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaDollarSign style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا توجد معاملات حالياً</div>
        </div>
      )}

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <AnimatePresence>
          {transactions?.map((tx, idx) => {
            const st = STATUS_MAP[tx.status] || { label: tx.status, cls: "badge-blue" };
            const userName  = tx.user?.name || tx.pendingUser?.name || "غير معروف";
            const planTitle = tx.plan?.title || "—";
            const amount    = tx.amount != null
              ? `${(tx.amount / 100).toLocaleString()} ${(tx.currency || "").toUpperCase()}`
              : "—";

            return (
              <motion.div
                key={tx.id || idx}
                className="card"
                style={{ padding: "1rem 1.2rem" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.22 }}
              >
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between", alignItems: "center" }}>
                  {/* Left */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", flex: 1, minWidth: 180 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, fontSize: "0.95rem" }}>
                      <FaUser style={{ color: "var(--blue)", fontSize: "0.8rem" }} />
                      {userName}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--green)", fontWeight: 700 }}>
                      <FaDollarSign style={{ fontSize: "0.8rem" }} />
                      {amount}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                      <FaCalendarAlt style={{ color: "var(--blue)", fontSize: "0.75rem" }} />
                      {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                    </div>
                  </div>

                  {/* Right */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "flex-end" }}>
                    <span style={{ fontWeight: 600, color: "var(--blue)", fontSize: "0.88rem" }}>{planTitle}</span>
                    <span className={`badge ${st.cls}`}>
                      {tx.status === "succeeded" ? <FaCheckCircle /> : <FaHourglass />}
                      {st.label}
                    </span>
                    {tx.checkoutUrl && (
                      <a
                        href={tx.checkoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: "0.78rem" }}
                        onClick={e => e.stopPropagation()}
                      >
                        <FaLink /> عرض الدفع
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
