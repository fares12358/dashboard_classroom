"use client";
import React, { useState, useEffect } from "react";
import PlanCard from "../Components/PlanCard";
import {
  FaPlus,
  FaSpinner,
  FaClipboardList,
  FaDollarSign,
  FaClock,
  FaFileAlt,
  FaSyncAlt,
  FaSync, // ✅ added for refresh icon
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { API_URL } from "../utils/api.js";
import { useAppContext } from "../Context/AppContext";

const Plans = () => {
  const { plans, setPlans } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ state for refresh btn

  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    price: "",
    durationValue: "",
    durationType: "",
  });

  // 🔹 Get Plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/plans`);
      setPlans(res.data.plans || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("❌ خطأ أثناء تحميل الخطط");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add Plan
  const addPlan = async () => {
    if (!newPlan.title || !newPlan.price || !newPlan.durationValue || !newPlan.durationType) {
      toast.error("⚠️ من فضلك أدخل جميع البيانات");
      return;
    }

    try {
      setAdding(true);
      const payload = {
        ...newPlan,
        price: Number(newPlan.price),
        durationValue: Number(newPlan.durationValue),
      };

      const res = await axios.post(`${API_URL}/plans/add`, payload);
      if (!res.data?.plan) throw new Error("الخادم لم يرجع البيانات المتوقعة");
      fetchPlans();
      setNewPlan({ title: "", description: "", price: "", durationValue: "", durationType: "" });
      toast.success("✅ تمت إضافة الخطة بنجاح");
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error(error.response?.data?.message || "❌ خطأ أثناء إضافة الخطة");
    } finally {
      setAdding(false);
    }
  };

  // 🔹 Refresh Plans manually
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchPlans();
      toast.success("✅ تم تحديث الخطط");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (plans !== null) return;
    fetchPlans();
  }, []);

  // 🔹 Handlers for PlanCard callbacks
  const handleDeleted = (deletedId) => {
    setPlans((prev) => prev.filter((p) => p._id !== deletedId));
    toast.success("✅ تم حذف الخطة");
  };

  const handleUpdated = () => {
    fetchPlans(); // re-fetch updated plans
  };

  return (
    <div>
      <Toaster />

      {/* Title + Refresh */}
      <div className="flex justify-between items-center mb-6 mr-10 md:mr-0">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-[#1998e1]">
          <FaClipboardList /> الخطط
        </h2>
        {/* ✅ Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          <span className="hidden md:inline">تحديث</span>
        </button>
      </div>

      {/* إضافة خطة */}
      <div className="bg-[#1a1a1a] p-6 rounded-xl shadow mb-8 border border-gray-700">
        <h3 className="text-xl font-semibold text-[#1998e1] mb-4 flex items-center gap-2">
          <FaPlus /> إضافة خطة جديدة
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Title */}
          <div className="flex items-center gap-2 bg-[#111] p-2 rounded border border-gray-700">
            <FaClipboardList className="text-gray-400" />
            <input
              type="text"
              placeholder="اسم الخطة"
              value={newPlan.title}
              onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              className="p-2 flex-1 bg-transparent text-white outline-none"
            />
          </div>

          {/* Duration value */}
          <div className="flex items-center gap-2 bg-[#111] p-2 rounded border border-gray-700">
            <FaClock className="text-gray-400" />
            <input
              type="number"
              placeholder="المدة (عدد)"
              value={newPlan.durationValue}
              onChange={(e) => setNewPlan({ ...newPlan, durationValue: e.target.value })}
              className="p-2 flex-1 bg-transparent text-white outline-none"
            />
          </div>

          {/* Duration type */}
          <select
            value={newPlan.durationType}
            onChange={(e) => setNewPlan({ ...newPlan, durationType: e.target.value })}
            className="p-3 rounded bg-[#111] text-white border border-gray-700"
          >
            <option value="">اختر نوع المدة</option>
            <option value="day">يوم</option>
            <option value="week">أسبوع</option>
            <option value="month">شهر</option>
            <option value="year">سنة</option>
          </select>

          {/* Price */}
          <div className="flex items-center gap-2 bg-[#111] p-2 rounded border border-gray-700">
            <FaDollarSign className="text-gray-400" />
            <input
              type="number"
              placeholder="السعر (مثال: 500)"
              value={newPlan.price}
              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
              className="p-2 flex-1 bg-transparent text-white outline-none"
            />
          </div>

          {/* Description */}
          <div className="flex items-center gap-2 bg-[#111] p-2 rounded border border-gray-700 md:col-span-2">
            <FaFileAlt className="text-gray-400" />
            <input
              type="text"
              placeholder="الوصف"
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              className="p-2 flex-1 bg-transparent text-white outline-none"
            />
          </div>
        </div>

        <button
          onClick={addPlan}
          disabled={adding}
          className={`${adding
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600/20 hover:bg-green-600/30"
            } text-green-500 px-6 py-2 rounded-lg transition flex items-center gap-2 cursor-pointer`}
        >
          {adding ? <FaSpinner className="animate-spin" /> : <FaPlus />}{" "}
          {adding ? "جاري الإضافة..." : "إضافة خطة"}
        </button>
      </div>

      {/* شبكة الخطط */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-3xl text-[#1998e1]" />
          <span className="ml-3 text-gray-300">جارٍ تحميل الخطط...</span>
        </div>
      ) : plans?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans?.map((plan, index) => (
            <PlanCard
              key={plan._id || index}
              id={plan._id}
              title={plan.title}
              duration={`${plan.durationValue} ${plan.durationType}`}
              price={plan.price}
              description={plan.description}
              onDeleted={handleDeleted} // 🔹 refresh after delete
              onUpdated={handleUpdated} // 🔹 refresh after update
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center">🚀 لا توجد خطط مضافة بعد</p>
      )}
    </div>
  );
};

export default Plans;
