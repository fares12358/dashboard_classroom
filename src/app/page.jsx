"use client";
import { useEffect, useState, useRef } from "react";
import {
  FaHome, FaUser, FaSignOutAlt, FaChartBar, FaBars,
  FaChalkboardTeacher, FaUserGraduate, FaClipboardList,
  FaMoneyBillWave, FaUserClock, FaGraduationCap,
  FaChevronLeft, FaChevronRight, FaTimes,
} from "react-icons/fa";
import Classrooms from "./Components/Classrooms";
import DashboardHome from "./Components/DashboardHome";
import Plans from "./Components/Plans";
import Profile from "./Components/Profile";
import Reports from "./Components/Reports";
import Students from "./Components/Students";
import { useAppContext } from "./Context/AppContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_URL } from "./utils/api.js";
import Transactions from "./Components/Transactions";
import PendingUsers from "./Components/PendingUsers";
import { motion, AnimatePresence } from "framer-motion";

/* ── Nav items ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { key: "home", label: "الرئيسية", icon: FaHome },
  { key: "students", label: "الطلاب", icon: FaUserGraduate },
  { key: "classrooms", label: "الكلاسات", icon: FaChalkboardTeacher },
  { key: "reports", label: "التقارير", icon: FaChartBar },
  { key: "plans", label: "الخطط", icon: FaClipboardList },
  { key: "transactions", label: "المعاملات", icon: FaMoneyBillWave },
  { key: "pending", label: "حسابات معلقة", icon: FaUserClock },
  { key: "profile", label: "الملف الشخصي", icon: FaUser },
];

/* ── Full-screen loader ────────────────────────────────────────── */
function FullLoader() {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(8,12,16,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, backdropFilter: "blur(4px)",
    }}>
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
    </div>
  );
}

/* ── Hover tooltip (shown when sidebar is collapsed) ───────────── */
function SidebarTooltip({ label, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.15 }}
          style={{
            position: "absolute",
            left: "calc(100% + 10px)",
            top: "50%", transform: "translateY(-50%)",
            background: "var(--bg-card-2)",
            border: "1px solid var(--border-blue)",
            color: "var(--text-main)",
            fontSize: "0.8rem", fontWeight: 600,
            padding: "5px 10px", borderRadius: 8,
            whiteSpace: "nowrap", pointerEvents: "none",
            zIndex: 200,
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          }}
        >
          {label}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Single nav button ─────────────────────────────────────────── */
function NavItem({ item, active, collapsed, onClick }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`sidebar-item ${active ? "active" : ""}`}
        style={{
          width: "100%",
          justifyContent: collapsed ? "center" : "flex-start",
          border: active ? "1px solid var(--border-blue)" : "1px solid transparent",
          background: active ? "var(--blue-dim)" : "none",
          color: active ? "var(--blue)" : "var(--text-muted)",
        }}
      >
        <Icon style={{
          fontSize: "1rem", flexShrink: 0,
          color: active ? "var(--blue)" : "var(--text-muted)",
          transition: "color 0.2s",
        }} />
        {!collapsed && <span className="sidebar-label">{item.label}</span>}
      </button>
      {collapsed && <SidebarTooltip label={item.label} visible={hovered} />}
    </div>
  );
}

/* ── Logout button ─────────────────────────────────────────────── */
function LogoutBtn({ collapsed, onLogout }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onLogout}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="sidebar-item"
        style={{
          width: "100%",
          justifyContent: collapsed ? "center" : "flex-start",
          border: "1px solid transparent",
          background: "none",
          color: "var(--red)",
        }}
      >
        <FaSignOutAlt style={{ fontSize: "1rem", flexShrink: 0, color: "var(--red)" }} />
        {!collapsed && <span className="sidebar-logout-label">تسجيل الخروج</span>}
      </button>
      {collapsed && <SidebarTooltip label="تسجيل الخروج" visible={hovered} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const {
    isLogin, setIsLogin, user, setUser,
    activePage, setActivePage,
    classrooms, setClassrooms,
    setStudents, setPlans, setTransactions,
    setActiveTab, setpendingUsers,
    setReports, setHomeReport, setClassesData,
  } = useAppContext();

  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  /* ── Auth guard ─────────────────────────────────────────────── */
  useEffect(() => {
    const check = async () => {
      const token = getToken();
      if (!token) { router.push("/Pages/Auth/login"); return; }
      try {
        setPageLoading(true);
        const res = await axios.get(`${API_URL}/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLogin(true);
        setUser(res.data.admin);
      } catch {
        if (typeof window !== "undefined") localStorage.removeItem("adminToken");
        setIsLogin(false);
        setUser(null);
        router.push("/Pages/Auth/login");
      } finally {
        setPageLoading(false);
      }
    };
    if (!isLogin || !user) check();
  }, []);

  /* ── Pre-load classrooms ────────────────────────────────────── */
  useEffect(() => {
    if (classrooms) return;
    const token = getToken();
    if (!token) return;
    axios
      .get(`${API_URL}/admin/classes`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setClassrooms(res.data))
      .catch(() => { });
  }, []);

  /* ── Logout ─────────────────────────────────────────────────── */
  const handleLogout = () => {
    setIsLogin(false); setUser(null); setClassrooms(null);
    setStudents(null); setPlans(null); setTransactions(null);
    setpendingUsers(null); setActivePage("home"); setActiveTab("home");
    setReports(null); setHomeReport(null); setClassesData([]);
    if (typeof window !== "undefined") localStorage.removeItem("adminToken");
    router.push("/Pages/Auth/login");
  };

  const handleNav = (key) => { setActivePage(key); setMobileOpen(false); };

  const renderContent = () => {
    switch (activePage) {
      case "students": return <Students />;
      case "reports": return <Reports />;
      case "plans": return <Plans />;
      case "profile": return <Profile />;
      case "transactions": return <Transactions />;
      case "pending": return <PendingUsers />;
      case "classrooms": return <Classrooms />;
      default: return <DashboardHome />;
    }
  };

  /* ── Auth loading splash ────────────────────────────────────── */
  if (!isLogin || !user) {
    return (
      <div style={{
        height: "100vh", width: "100vw",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg-root)",
      }}>
        <div className="spinner" style={{ width: 44, height: 44, borderWidth: 4 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh", display: "flex", overflow: "hidden",
        background: "var(--bg-root)", color: "var(--text-main)",
      }}
      dir="rtl"
    >
      {pageLoading && <FullLoader />}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 29, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ══════════════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════════════ */}
      <aside
        className={`sidebar-wrapper ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Logo strip */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: collapsed ? 0 : "0.65rem",
          padding: collapsed ? "1rem 0" : "1rem 1rem",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid var(--border)",
          marginBottom: "0.5rem",
          minHeight: 64,
          transition: "padding 0.28s",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--blue)", fontSize: "1rem",
          }}>
            <FaGraduationCap />
          </div>
          {!collapsed && (
            <div className="sidebar-logo-text" style={{ minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "var(--text-main)", whiteSpace: "nowrap" }}>
                لوحة التحكم
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </div>
            </div>
          )}
          {/* Mobile ✕ */}
          <button
            onClick={() => setMobileOpen(false)}
            id="dash-close-btn"
            style={{
              display: "none", position: "absolute", left: "0.75rem",
              top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: "1rem", padding: 0,
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav */}
        <nav
          className="hide-scroll"
          style={{
            flex: 1, display: "flex", flexDirection: "column", gap: "2px",
            padding: collapsed ? "0 0.4rem" : "0 0.75rem",
            overflowY: "auto", overflowX: "hidden",
            transition: "padding 0.28s",
          }}
        >
          {NAV_ITEMS.map(item => (
            <NavItem
              key={item.key}
              item={item}
              active={activePage === item.key}
              collapsed={collapsed}
              onClick={() => handleNav(item.key)}
            />
          ))}
        </nav>

        {/* Bottom */}
        <div style={{
          padding: collapsed ? "0.75rem 0.4rem" : "0.75rem",
          borderTop: "1px solid var(--border)",
          display: "flex", flexDirection: "column", gap: "4px",
          transition: "padding 0.28s",
        }}>
          <LogoutBtn collapsed={collapsed} onLogout={handleLogout} />

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(v => !v)}
            className="sidebar-item"
            style={{
              width: "100%",
              justifyContent: collapsed ? "center" : "flex-start",
              border: "1px solid transparent", background: "none",
              color: "var(--text-dim)", fontSize: "0.78rem",
            }}
            title={collapsed ? "توسيع" : "تصغير"}
          >
            {collapsed
              ? <FaChevronLeft style={{ fontSize: "0.8rem" }} />
              : <><FaChevronRight style={{ fontSize: "0.8rem" }} /><span className="sidebar-label">تصغير</span></>
            }
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════
          MAIN
      ══════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: 56, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-panel)", gap: "0.75rem",
        }}>
          <button
            onClick={() => setMobileOpen(true)}
            id="dash-menu-btn"
            className="btn btn-ghost btn-sm btn-icon"
            style={{ display: "none" }}
          >
            <FaBars />
          </button>

          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-main)" }}>
            {NAV_ITEMS.find(n => n.key === activePage)?.label ?? "الرئيسية"}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "var(--bg-card-2)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "0.3rem 0.75rem",
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: "50%",
              background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--blue)", fontSize: "0.75rem", flexShrink: 0,
            }}>
              <FaUser />
            </div>
            <span style={{
              fontSize: "0.8rem", fontWeight: 600,
              maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {user?.name}
            </span>
          </div>
        </header>

        {/* Content */}
        <main
          className="hide-scroll"
          style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #dash-menu-btn  { display: flex !important; }
          #dash-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
