"use client";
import React, { useEffect, useState } from "react";
import { FaUser, FaDollarSign, FaCalendarAlt, FaLink, FaSpinner, FaSync } from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api.js";
import { useAppContext } from "../Context/AppContext.jsx";

export default function Transactions() {
  const { transactions, setTransactions } = useAppContext();
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/admin/transactions`);
      if (res.data.success) {
        setTransactions(res.data.data);
      } else {
        toast.error("فشل في جلب المعاملات ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الاتصال بالخادم ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // ✅ أول مرة فقط أو لو transactions فاضية
    if (!transactions) {
      fetchTransactions();
    }
  }, [transactions]);

  return (
    <div className="bg-[#1a1a1a] rounded-2xl shadow-lg p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1998e1] mr-10 md:mr-0">💳 التحويلات</h2>

        {/* زر تحديث */}
        <button
          onClick={fetchTransactions}
          disabled={loading}
          className="flex items-center gap-2 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
          <span className="ho hidden md:inline">
            تحديث
          </span>
        </button>
      </div>

      {/* محتوى الصفحة */}
      {loading && !transactions ? (
        <div className="flex justify-center items-center h-[60vh] text-[#1998e1]">
          <FaSpinner className="animate-spin text-3xl" />
          <span className="ml-3">جاري تحميل المعاملات...</span>
        </div>
      ) : transactions?.length === 0 ? (
        <p className="text-gray-400 text-center">لا توجد تحويلات حالياً.</p>
      ) : (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto hidde_scroll">
          {transactions?.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#222] p-4 rounded-xl shadow-md flex flex-col sm:flex-row sm:justify-between gap-3"
            >
              {/* معلومات المستخدم والخطة */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <FaUser className="text-[#1998e1]" />
                  <span>{tx.user ? tx.user.name : tx.pendingUser ? tx.pendingUser.name : "غير معروف"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaDollarSign className="text-green-500" />
                  <span>
                    {(tx.amount / 100).toLocaleString()} {tx.currency.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400" />
                  <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.status === "succeeded"
                      ? "bg-green-600 text-white"
                      : "bg-yellow-500 text-white"
                      }`}
                  >
                    {tx.status === "succeeded" ? "ناجحة" : "معلقة"}
                  </span>
                </div>
              </div>

              {/* تفاصيل الخطة */}
              <div className="flex flex-col gap-2">
                <span className="font-semibold text-[#1998e1]">{tx.plan.title}</span>
              </div>

              {/* رابط الدفع */}
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <a
                  href={tx.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 bg-[#1998e1]/20 hover:bg-[#1998e1]/30 text-[#1998e1] px-3 py-2 rounded-lg transition"
                >
                  <FaLink /> عرض الدفع
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
