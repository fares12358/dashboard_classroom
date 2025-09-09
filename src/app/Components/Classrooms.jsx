"use client";
import React from "react";
import ClassroomCard from "../Components/ClassroomCard";

const Classrooms = () => {
  // بيانات تجريبية للكلاسات
  const classrooms = [
    { 
      name: "Math Class", 
      id: "ABC123", 
      students: 25, 
      createdAt: "2025-09-01",
      videos: 12,
      files: 8,
      tasks: 5
    },
    { 
      name: "Science Class", 
      id: "XYZ789", 
      students: 18, 
      createdAt: "2025-08-20",
      videos: 6,
      files: 3,
      tasks: 2
    },
    { 
      name: "History Class", 
      id: "HIS456", 
      students: 30, 
      createdAt: "2025-09-05",
      videos: 9,
      files: 7,
      tasks: 4
    },
  ];  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الكلاسات</h2>

      {/* شبكة الكروت */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <ClassroomCard
            key={classroom.id}
            {...classroom} // تمرير جميع البيانات مرة واحدة
          />
        ))}
      </div>
    </div>
  );
};

export default Classrooms;
