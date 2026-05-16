"use client";
import React from "react";

export default function ReportCard({ title, description, icon: Icon, value }) {
  return (
    <div className="stat-card card-hover" style={{ cursor: "default" }}>
      <div className="stat-icon">
        {Icon && <Icon />}
      </div>
      <div>
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {description && <div className="stat-desc">{description}</div>}
      </div>
    </div>
  );
}
