"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaLink,
  FaHourglass,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../Context/AppContext";
import { API_URL } from "../utils/api";


// 🔹 Helper: format time left
const formatTimeLeft = (ms) => {
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}س ${minutes}د ${seconds}ث`;
};

export default function PendingUsers() {
  const { pendingUsers, setpendingUsers } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({}); // store timers per user

  // Fetch or reuse pending users
  useEffect(() => {
    const initTimers = (users) => {
      const timers = {};
      users.forEach((user) => {
        if (user.expireAt) {
          timers[user.id] = new Date(user.expireAt).getTime() - Date.now();
        }
      });
      setTimeLeft(timers);
    };

    const fetchPendingUsers = async () => {
      if (pendingUsers && pendingUsers.length > 0) {
        // ✅ إذا فيه بيانات في الـ Context، نعيد حساب العدادات
        initTimers(pendingUsers);
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/admin/pendingUsers`);
        if (res.data.success) {
          setpendingUsers(res.data.data);
          toast.success("✅ تم جلب المستخدمين بنجاح");
          initTimers(res.data.data);
        } else {
          toast.error(res.data.message || "فشل في جلب المستخدمين ❌");
        }
      } catch (err) {
        console.error(err);
        toast.error("حدث خطأ أثناء جلب المستخدمين ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [pendingUsers, setpendingUsers]);

  // 🔹 Countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = {};
        Object.keys(prev).forEach((id) => {
          const newTime = prev[id] - 1000;
          if (newTime > 0) {
            updated[id] = newTime;
          } else {
            // ✅ Remove expired user from context
            setpendingUsers((users) =>
              users.filter((user) => String(user.id) !== String(id))
            );
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [setpendingUsers]);

  return (
    <div className="p-6 bg-[#1a1a1a] rounded-2xl shadow-xl space-y-6">
      <Toaster position="top-center" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-[#1998e1] text-center">
        المستخدمون المعلقون
      </h2>

      {loading ? (
        <p className="text-gray-300 animate-pulse text-center">
          ⏳ جاري التحميل...
        </p>
      ) : pendingUsers?.length === 0 ? (
        <p className="text-gray-300 text-center">
          📌 لا يوجد مستخدمين معلقين حالياً.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {pendingUsers?.map((user) => {
              const msLeft = timeLeft[user.id] || 0;
              const remaining = formatTimeLeft(msLeft);

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="bg-[#111] rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.01] transition-all duration-300"
                >
                  {/* Header: user info */}
                  <div className="flex flex-col gap-2 border-b border-gray-700 pb-3">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <FaUser className="text-[#1998e1]" />
                      {user.name}
                    </h3>
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <FaEnvelope className="text-[#1998e1]" /> {user.email}
                    </p>
                    <p className="text-sm text-gray-300 flex items-center gap-2">
                      <FaPhone className="text-[#1998e1]" /> {user.phone}
                    </p>

                    {/* Status with countdown */}
                    <div className="flex items-center gap-2 mt-2">
                      {remaining ? (
                        <span className="text-xs text-yellow-400 flex items-center gap-1">
                          <FaHourglass />
                          ينتهي خلال: {remaining}
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400">
                          منتهية الصلاحية
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Plan Section */}
                  {user.plan && (
                    <div className="bg-[#1a1a1a] border border-gray-700 mt-3 p-3 rounded-lg">
                      <h4 className="font-semibold text-[#1998e1] mb-2">
                        تفاصيل الخطة
                      </h4>
                      <p className="text-sm text-gray-300">
                        <FaMoneyBillWave className="inline ml-2 text-[#1998e1]" />
                        {user.plan.title} - ${user.plan.price} /{" "}
                        {user.plan.durationValue} {user.plan.durationType}
                      </p>
                    </div>
                  )}

                  {/* Transaction Section */}
                  {user.transaction && (
                    <div className="bg-[#1a1a1a] border border-gray-700 mt-3 p-3 rounded-lg">
                      <h4 className="font-semibold text-[#1998e1] mb-2">
                        تفاصيل المعاملة
                      </h4>
                      <p className="text-sm text-gray-300">
                        💵 مبلغ: ${user.transaction.amount}{" "}
                        {user.transaction.currency}
                      </p>
                      <p className="text-sm text-gray-300">
                        📝 الحالة: {user.transaction.status}
                      </p>
                      <p className="text-sm text-gray-300 flex items-center gap-1">
                        <FaCalendarAlt className="text-[#1998e1]" />
                        {new Date(
                          user.transaction.createdAt
                        ).toLocaleString("ar-EG")}
                      </p>
                      {user.transaction.checkoutUrl && (
                        <a
                          href={user.transaction.checkoutUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline text-sm mt-1 inline-block"
                        >
                          <FaLink className="inline ml-1" />
                          رابط الدفع
                        </a>
                      )}
                    </div>
                  )}

                  {/* PendingUser checkout link */}
                  {user.checkoutUrl && (
                    <a
                      href={user.checkoutUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-blue-400 hover:underline mt-3 text-sm text-center"
                    >
                      <FaLink className="inline ml-1" />
                      رابط التفعيل
                    </a>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
