"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaUsers, FaBars, FaTimes, FaHome, FaVideo, FaFilePdf,
  FaArrowRight, FaStickyNote, FaFileAlt, FaChalkboardTeacher,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import { useAppContext } from "@/app/Context/AppContext";
import HomeTab        from "@/app/Components/Classroom/HomeTab";
import StudentsTab    from "@/app/Components/Classroom/StudentsTab";
import VideosTab      from "@/app/Components/Classroom/VideosTab";
import FilesTab       from "@/app/Components/Classroom/FilesTab";
import NotesTab       from "@/app/Components/Classroom/NotesTab";
import TaskTab        from "@/app/Components/Classroom/TaskTab";
import ReceivedTaskTab from "@/app/Components/Classroom/ReceivedTaskTab";
import { motion, AnimatePresence } from "framer-motion";

const TABS = [
  { key: "home",     label: "الرئيسية",   icon: FaHome },
  { key: "students", label: "الطلاب",      icon: FaUsers },
  { key: "videos",   label: "الفيديوهات", icon: FaVideo },
  { key: "files",    label: "الملفات",    icon: FaFilePdf },
  { key: "taskes",   label: "الاختبارات", icon: FaFileAlt },
  { key: "received", label: "التسليمات",  icon: FaFileAlt },
  { key: "notes",    label: "الملاحظات", icon: FaStickyNote },
];

/* ── Tooltip (shown only when collapsed) ─────────────────────── */
const Tooltip = ({ label, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "absolute",
          left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)",
          background: "var(--bg-card-2)", border: "1px solid var(--border-blue)",
          color: "var(--text-main)", fontSize: "0.8rem", fontWeight: 600,
          padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap",
          pointerEvents: "none", zIndex: 200,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        {label}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Tab nav item ─────────────────────────────────────────────── */
const TabItem = ({ tab, active, collapsed, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = tab.icon;
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
          textAlign: "right",
          border: active ? "1px solid var(--border-blue)" : "1px solid transparent",
          background: active ? "var(--blue-dim)" : "none",
          color: active ? "var(--blue)" : "var(--text-muted)",
        }}
      >
        <Icon style={{ fontSize: "1rem", flexShrink: 0, color: active ? "var(--blue)" : "var(--text-muted)" }} />
        {!collapsed && <span>{tab.label}</span>}
      </button>
      {collapsed && <Tooltip label={tab.label} visible={hovered} />}
    </div>
  );
};

export default function ClassroomDetailPage() {
  const { id }    = useParams();
  const router    = useRouter();
  const { openClass, isLogin, user } = useAppContext();

  const [activeTab,   setActiveTab]   = useState("home");
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  /* ── Auth guard ────────────────────────────────────────────── */
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
    if (!token || !user || !isLogin) router.push("/Pages/Auth/login");
  }, []);

  useEffect(() => { if (id) openClass(id); }, [id]);

  /* ── Tab renderer ──────────────────────────────────────────── */
  const renderTab = () => {
    switch (activeTab) {
      case "home":     return <HomeTab classID={id} />;
      case "students": return <StudentsTab classID={id} />;
      case "videos":   return <VideosTab classID={id} />;
      case "files":    return <FilesTab classID={id} />;
      case "notes":    return <NotesTab classID={id} />;
      case "taskes":   return <TaskTab classID={id} />;
      case "received": return <ReceivedTaskTab classID={id} />;
      default:         return <HomeTab classID={id} />;
    }
  };

  const handleTab = (key) => { setActiveTab(key); setMobileOpen(false); };

  return (
    <div
      style={{ height: "100vh", display: "flex", overflow: "hidden", background: "var(--bg-root)", color: "var(--text-main)" }}
      dir="rtl"
    >
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            zIndex: 29, backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* ════════════════════════════════════════════════════════
          SIDEBAR
      ════════════════════════════════════════════════════════ */}
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
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: "var(--blue-dim)", border: "1px solid var(--border-blue)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--blue)", fontSize: "1rem",
          }}>
            <FaChalkboardTeacher />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--text-main)" }}>إدارة الكلاس</div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>كود: {id?.slice(-6)}</div>
            </div>
          )}
          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              display: "none", position: "absolute", left: "0.75rem",
              top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", fontSize: "1rem",
            }}
            id="cls-close-btn"
          >
            <FaTimes />
          </button>
        </div>

        {/* Nav tabs */}
        <nav
          className="hide-scroll"
          style={{
            flex: 1, display: "flex", flexDirection: "column", gap: "2px",
            padding: collapsed ? "0 0.4rem" : "0 0.75rem",
            overflowY: "auto", overflowX: "hidden",
            transition: "padding 0.28s",
          }}
        >
          {TABS.map(tab => (
            <TabItem
              key={tab.key}
              tab={tab}
              active={activeTab === tab.key}
              collapsed={collapsed}
              onClick={() => handleTab(tab.key)}
            />
          ))}
        </nav>

        {/* Bottom: back + collapse */}
        <div style={{
          padding: collapsed ? "0.75rem 0.4rem" : "0.75rem",
          borderTop: "1px solid var(--border)",
          display: "flex", flexDirection: "column", gap: "4px",
          transition: "padding 0.28s",
        }}>
          {/* Back */}
          <div style={{ position: "relative" }}>
            <BackBtn collapsed={collapsed} onClick={() => router.push("/")} />
          </div>
          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed(v => !v)}
            className="sidebar-item"
            style={{
              width: "100%", justifyContent: collapsed ? "center" : "flex-start",
              border: "1px solid transparent", background: "none",
              color: "var(--text-dim)", fontSize: "0.78rem",
            }}
          >
            {collapsed
              ? <FaChevronLeft style={{ fontSize: "0.8rem" }} />
              : <><FaChevronRight style={{ fontSize: "0.8rem" }} /><span>تصغير</span></>
            }
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════════════════
          MAIN
      ════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: 56, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 1.25rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-panel)", gap: "0.75rem",
        }}>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="btn btn-ghost btn-sm btn-icon"
            id="cls-menu-btn"
            style={{ display: "none" }}
          >
            <FaBars />
          </button>

          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            {TABS.find(t => t.key === activeTab)?.label}
          </div>

          <button onClick={() => router.push("/")} className="btn btn-ghost btn-sm" style={{ gap: 6 }}>
            <FaArrowRight style={{ fontSize: "0.8rem" }} />
            <span style={{ fontSize: "0.82rem" }}>العودة</span>
          </button>
        </header>

        {/* Content */}
        <div className="hide-scroll" style={{ flex: 1, overflowY: "auto", padding: "1.5rem" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Inline responsive CSS */}
      <style>{`
        @media (max-width: 768px) {
          #cls-menu-btn  { display: flex !important; }
          #cls-close-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Back button with tooltip when collapsed ──────────────────── */
function BackBtn({ collapsed, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="sidebar-item"
        style={{
          width: "100%", justifyContent: collapsed ? "center" : "flex-start",
          border: "1px solid transparent", background: "none",
          color: "var(--text-muted)",
        }}
      >
        <FaArrowRight style={{ fontSize: "1rem", flexShrink: 0 }} />
        {!collapsed && <span>العودة للرئيسية</span>}
      </button>
      {collapsed && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", left: "calc(100% + 10px)", top: "50%", transform: "translateY(-50%)",
                background: "var(--bg-card-2)", border: "1px solid var(--border-blue)",
                color: "var(--text-main)", fontSize: "0.8rem", fontWeight: 600,
                padding: "5px 10px", borderRadius: 8, whiteSpace: "nowrap",
                pointerEvents: "none", zIndex: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              العودة للرئيسية
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
