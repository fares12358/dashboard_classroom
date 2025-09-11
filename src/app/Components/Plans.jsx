"use client";
import React, { useState } from "react";
import PlanCard from "../Components/PlanCard";
import { FaPlus } from "react-icons/fa";
import toast from "react-hot-toast";

const Plans = () => {
  const [plans, setPlans] = useState([
    {
      title: "الخطة الشهرية",
      duration: "شهر واحد",
      price: "100 جنيه",
      description: "اشتراك لمدة شهر واحد يشمل جميع المميزات.",
    },
    {
      title: "الخطة ربع السنوية",
      duration: "3 أشهر",
      price: "250 جنيه",
      description: "اشتراك لمدة 3 أشهر بتخفيض خاص.",
    },
    {
      title: "الخطة السنوية",
      duration: "12 شهر",
      price: "900 جنيه",
      description: "اشتراك لمدة سنة كاملة بأقل سعر.",
    },
  ]);

  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
  });

  const addPlan = () => {
    if (!newPlan.title || !newPlan.price || !newPlan.duration) {
      toast.error("من فضلك أدخل جميع البيانات");
      return;
    }
    setPlans([...plans, newPlan]);
    setNewPlan({ title: "", description: "", price: "", duration: "" });
    toast.success("تمت إضافة الخطة بنجاح ✅");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الخطط</h2>

      {/* قسم إضافة خطة جديدة */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold text-[#1998e1] mb-4">
          إضافة خطة جديدة
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="اسم الخطة"
            value={newPlan.title}
            onChange={(e) =>
              setNewPlan({ ...newPlan, title: e.target.value })
            }
            className="p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-[#1998e1] transition-all ease-in-out duration-300"
          />
          <input
            type="text"
            placeholder="المدة (مثال: 6 أشهر)"
            value={newPlan.duration}
            onChange={(e) =>
              setNewPlan({ ...newPlan, duration: e.target.value })
            }
            className="p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-[#1998e1] transition-all ease-in-out duration-300"
          />
          <input
            type="text"
            placeholder="السعر (مثال: 500 جنيه)"
            value={newPlan.price}
            onChange={(e) =>
              setNewPlan({ ...newPlan, price: e.target.value })
            }
            className="p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-[#1998e1] transition-all ease-in-out duration-300"
          />
          <input
            type="text"
            placeholder="الوصف"
            value={newPlan.description}
            onChange={(e) =>
              setNewPlan({ ...newPlan, description: e.target.value })
            }
            className="p-3 rounded bg-[#111] text-white border border-gray-700 focus:outline-none focus:border-[#1998e1] transition-all ease-in-out duration-300"
          />
        </div>
        <button
          onClick={addPlan}
          className="bg-green-600/20 text-green-500 px-6 py-2 rounded-lg hover:bg-green-600/30 transition flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> إضافة خطة
        </button>
      </div>

      {/* شبكة الخطط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            title={plan.title}
            duration={plan.duration}
            price={plan.price}
            description={plan.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Plans;
