"use client";
import React from "react";
import ClassroomCard from "../Components/ClassroomCard";

const Classrooms = () => {
  // بيانات تجريبية للكلاسات
  const classrooms = [
    { name: "Math Class", id: "ABC123", students: 25, createdAt: "2025-09-01" },
    { name: "Science Class", id: "XYZ789", students: 18, createdAt: "2025-08-20" },
    { name: "History Class", id: "HIS456", students: 30, createdAt: "2025-09-05" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الكلاسات</h2>

      {/* شبكة الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            name={classroom.name}
            id={classroom.id}
            students={classroom.students}
            createdAt={classroom.createdAt}
          />
        ))}
      </div>
    </div>
  );
};

export default Classrooms;
