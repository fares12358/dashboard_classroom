"use client";
import React, { useState, useEffect } from "react";
import PlanCard from "../Components/PlanCard";
import { FaPlus, FaSpinner, FaClipboardList, FaDollarSign, FaClock, FaFileAlt, FaSync } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import { useAppContext } from "../Context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const DURATION_OPTIONS = [
  { value: "day",   label: "يوم" },
  { value: "week",  label: "أسبوع" },
  { value: "month", label: "شهر" },
  { value: "year",  label: "سنة" },
];

export default function Plans() {
  const { plans, setPlans } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newPlan, setNewPlan] = useState({ title: "", description: "", price: "", durationValue: "", durationType: "" });

  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/plans`, { headers: { Authorization: `Bearer ${getToken()}` } });
      setPlans(res.data.plans || []);
    } catch {
      toast.error("خطأ أثناء تحميل الخطط");
    } finally {
      setLoading(false);
    }
  };

  const addPlan = async () => {
    const { title, price, durationValue, durationType } = newPlan;
    if (!title || !price || !durationValue || !durationType) {
      toast.error("أدخل جميع البيانات المطلوبة");
      return;
    }
    setAdding(true);
    try {
      const res = await axios.post(`${API_URL}/plans/add`,
        { ...newPlan, price: Number(price), durationValue: Number(durationValue) },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (!res.data?.plan) throw new Error("response missing plan");
      await fetchPlans();
      setNewPlan({ title: "", description: "", price: "", durationValue: "", durationType: "" });
      setShowForm(false);
      toast.success("تمت إضافة الخطة بنجاح");
    } catch (err) {
      toast.error(err.response?.data?.message || "خطأ أثناء إضافة الخطة");
    } finally {
      setAdding(false);
    }
  };

  useEffect(() => { if (plans === null) fetchPlans(); }, []);

  const handleDeleted = (id) => setPlans(prev => prev.filter(p => p._id !== id));
  const handleUpdated = () => fetchPlans();

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-title">الخطط التعليمية</div>
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 2 }}>{plans?.length ?? 0} خطة متاحة</div>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <motion.button whileTap={{ scale: 0.92 }} onClick={fetchPlans} disabled={loading} className="btn btn-ghost btn-sm">
            {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          </motion.button>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => setShowForm(v => !v)} className="btn btn-primary btn-sm">
            <FaPlus /> {showForm ? "إغلاق" : "خطة جديدة"}
          </motion.button>
        </div>
      </div>

      {/* Add plan form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="card"
            style={{ padding: "1.4rem", marginBottom: "1.5rem" }}
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
          >
            <div style={{ fontWeight: 700, color: "var(--blue)", marginBottom: "1rem" }}>إضافة خطة جديدة</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ position: "relative" }}>
                <FaClipboardList style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
                <input className="input" style={{ paddingRight: "2.2rem" }} placeholder="اسم الخطة *" value={newPlan.title} onChange={e => setNewPlan({ ...newPlan, title: e.target.value })} />
              </div>
              <div style={{ position: "relative" }}>
                <FaClock style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
                <input className="input" style={{ paddingRight: "2.2rem" }} type="number" placeholder="المدة (عدد) *" value={newPlan.durationValue} onChange={e => setNewPlan({ ...newPlan, durationValue: e.target.value })} />
              </div>
              <select className="input" value={newPlan.durationType} onChange={e => setNewPlan({ ...newPlan, durationType: e.target.value })}>
                <option value="">نوع المدة *</option>
                {DURATION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div style={{ position: "relative" }}>
                <FaDollarSign style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
                <input className="input" style={{ paddingRight: "2.2rem" }} type="number" placeholder="السعر (cents) *" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} />
              </div>
              <div style={{ position: "relative", gridColumn: "1 / -1" }}>
                <FaFileAlt style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem" }} />
                <input className="input" style={{ paddingRight: "2.2rem" }} placeholder="الوصف (اختياري)" value={newPlan.description} onChange={e => setNewPlan({ ...newPlan, description: e.target.value })} />
              </div>
            </div>
            <button onClick={addPlan} disabled={adding} className="btn btn-success">
              {adding ? <FaSpinner className="animate-spin" /> : <FaPlus />}
              {adding ? "جاري الإضافة..." : "إضافة الخطة"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading */}
      {loading && !plans?.length && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 200, color: "var(--text-muted)" }}>
          <FaSpinner className="animate-spin" style={{ marginLeft: 8 }} /> جارٍ تحميل الخطط...
        </div>
      )}

      {/* Plans grid */}
      {plans?.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: "1rem" }}>
          <AnimatePresence>
            {plans.map((plan, idx) => (
              <motion.div
                key={plan._id || idx}
                initial={{ opacity: 0, y: 18, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <PlanCard
                  id={plan._id}
                  title={plan.title}
                  duration={`${plan.durationValue} ${plan.durationType}`}
                  price={plan.price}
                  description={plan.description}
                  onDeleted={handleDeleted}
                  onUpdated={handleUpdated}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && plans?.length === 0 && (
        <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "3rem 0" }}>
          <FaClipboardList style={{ fontSize: "2.5rem", color: "var(--text-dim)", marginBottom: "0.75rem" }} />
          <div>لا توجد خطط مضافة بعد</div>
        </div>
      )}
    </div>
  );
}
