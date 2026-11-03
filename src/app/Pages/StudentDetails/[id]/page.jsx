"use client";
import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaIdBadge, FaUser, FaEnvelope, FaPhone, FaCalendarAlt,
  FaCheckCircle, FaTimesCircle, FaArrowRight, FaMoneyBillWave,
  FaCalendarCheck, FaCreditCard, FaChalkboardTeacher,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";

function InfoRow({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0.5rem 0" }}>
      <Icon style={{ color: "var(--blue)", fontSize: "0.85rem", flexShrink: 0 }} />
      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", minWidth: 110 }}>{label}:</span>
      <span style={{ fontWeight: 600, fontSize: "0.85rem" }} className={valueClass}>{value}</span>
    </div>
  );
}

export default function StudentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { students, isLogin, user } = useAppContext();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token || !user || !isLogin) { router.push("/Pages/Auth/login"); return; }
  }, []);

  // Derived from context; no state/effect needed
  const student = useMemo(
    () => (students && id ? students.find(s => String(s.id) === String(id)) || null : null),
    [students, id]
  );

  useEffect(() => {
    if (!students || !id) router.back();
  }, [students, id]);

  if (!student) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-root)" }}>
      <div className="spinner" />
    </div>
  );


  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-root)", color: "var(--text-main)", padding: "1.75rem 1.25rem" }} dir="rtl">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div className="section-title">تفاصيل الطالب</div>
          <button onClick={() => router.push("/")} className="btn btn-ghost btn-sm btn-icon">
            <FaArrowRight />
          </button>
        </div>

        {/* Student card */}
        <div className="card" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.1rem", paddingBottom: "1.1rem", borderBottom: "1px solid var(--border)" }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%",
              background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--blue)", fontSize: "1.3rem", flexShrink: 0,
            }}>
              <FaUser />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.05rem" }}>{student.name}</div>
              <span className={`badge ${student.status === "active" ? "badge-green" : "badge-red"}`} style={{ marginTop: 4 }}>
                {student.status === "active" ? <><FaCheckCircle /> نشط</> : <><FaTimesCircle /> غير نشط</>}
              </span>
            </div>
          </div>

          <InfoRow icon={FaIdBadge}     label="كود الطالب"     value={String(student.id)} />
          <InfoRow icon={FaEnvelope}    label="البريد"          value={student.email} />
          <InfoRow icon={FaPhone}       label="الهاتف"          value={student.phone || "—"} />
          <InfoRow icon={FaCalendarAlt} label="تاريخ الانضمام" value={new Date(student.createdAt).toLocaleDateString("ar-EG")} />
        </div>

        {/* Classes */}
        <div className="card" style={{ padding: "1.4rem", marginBottom: "1rem" }}>
          <div style={{ fontWeight: 700, color: "var(--blue)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FaChalkboardTeacher /> الفصول الدراسية
          </div>
          {Array.isArray(student.classes) && student.classes.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {student.classes.map((cls, idx) => (
                <div key={idx} style={{ background: "var(--bg-panel)", borderRadius: 9, padding: "0.5rem 0.85rem", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: 7 }}>
                  <FaChalkboardTeacher style={{ color: "var(--blue)", fontSize: "0.8rem" }} />
                  {typeof cls === "string" ? cls : cls.name}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>لا يوجد فصول مسجلة</div>
          )}
        </div>

        {/* Transactions */}
        <div className="card" style={{ padding: "1.4rem" }}>
          <div style={{ fontWeight: 700, color: "var(--blue)", marginBottom: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FaMoneyBillWave /> المعاملات المالية
          </div>
          {Array.isArray(student.transactions) && student.transactions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {student.transactions.map((tx, idx) => (
                <div key={idx} style={{ background: "var(--bg-panel)", borderRadius: 10, padding: "0.85rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.88rem" }}>
                      <FaMoneyBillWave style={{ color: "var(--green)" }} />
                      {/* FIX: tx.plan may be null */}
                      <strong style={{ color: "var(--green)" }}>
                        {tx.plan ? `$${tx.plan.price} ${tx.currency}` : `$— ${tx.currency || ""}`}
                      </strong>
                    </div>
                    <span className={`badge ${tx.status === "succeeded" ? "badge-green" : "badge-red"}`}>
                      <FaCreditCard style={{ fontSize: "0.65rem" }} />
                      {tx.status === "succeeded" ? "ناجحة" : "فاشلة"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    <FaCalendarCheck style={{ color: "var(--blue)", fontSize: "0.75rem" }} />
                    {new Date(tx.createdAt).toLocaleDateString("ar-EG")}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>لا يوجد معاملات</div>
          )}
        </div>
      </div>
    </div>
  );
}
