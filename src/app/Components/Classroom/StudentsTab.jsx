"use client";
import React from "react";
import StudentCard from "./StudentCard";

export default function StudentsTab({ students }) {
  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 space-y-4">
      <h2 className="text-2xl font-bold text-[#1998e1] mb-4">الطلاب</h2>
      {students && students.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <p className="text-gray-300">📌 لا يوجد طلاب حتى الآن.</p>
      )}
    </div>
  );
}
