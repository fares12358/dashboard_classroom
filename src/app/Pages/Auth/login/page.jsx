'use client';
import { useAppContext } from "@/app/Context/AppContext";
import React, { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSpinner, FaGraduationCap } from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { API_URL } from "@/app/utils/api.js";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading]             = useState(false);

  const { setIsLogin, setUser } = useAppContext();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور"); return; }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/admin/login`, { email, password });
      const { accessToken, admin } = response.data;

      setIsLogin(true);
      setUser(admin);
      if (typeof window !== "undefined") localStorage.setItem("adminToken", accessToken);
      toast.success(response.data.message || "تم تسجيل الدخول بنجاح");
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-root)",
        padding: "1.25rem",
      }}
      dir="rtl"
    >
      <Toaster position="top-center" />

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14,
            background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--blue)", fontSize: "1.5rem", marginBottom: "0.75rem",
          }}>
            <FaGraduationCap />
          </div>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)", margin: 0 }}>
            لوحة التحكم
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
            تسجيل دخول المسؤول
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: "2rem" }}>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                البريد الإلكتروني
              </label>
              <div style={{ position: "relative" }}>
                <FaUser style={{
                  position: "absolute", right: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem",
                }} />
                <input
                  type="email"
                  className="input"
                  style={{ paddingRight: "2.25rem" }}
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: 6 }}>
                كلمة المرور
              </label>
              <div style={{ position: "relative" }}>
                <FaLock style={{
                  position: "absolute", right: "0.75rem", top: "50%",
                  transform: "translateY(-50%)", color: "var(--text-dim)", fontSize: "0.8rem",
                }} />
                <input
                  type={passwordVisible ? "text" : "password"}
                  className="input"
                  style={{ paddingRight: "2.25rem", paddingLeft: "2.5rem" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(v => !v)}
                  style={{
                    position: "absolute", left: "0.75rem", top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "var(--blue)",
                    padding: 0, fontSize: "0.85rem",
                  }}
                >
                  {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.96 }}
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "0.65rem", fontSize: "0.95rem", marginTop: "0.25rem" }}
            >
              {loading ? (
                <><FaSpinner className="animate-spin" /> جارٍ تسجيل الدخول...</>
              ) : (
                "دخول"
              )}
            </motion.button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-dim)", marginTop: "1.5rem" }}>
          لوحة تحكم خاصة بالمسؤولين فقط
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
