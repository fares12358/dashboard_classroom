"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const CancelPage = () => {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const [loading, setLoading] = useState(false);

  const handleRetryPayment = async () => {
    if (!paymentId) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment/retry`,
        { paymentId }
      );
      window.location.href = res.data.url; // redirect to new checkout session
    } catch (err) {
      console.error("Retry error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // auto start retry when page loads
    if (paymentId) {
      handleRetryPayment();
    }
  }, [paymentId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-2xl font-bold text-red-600">
        ❌ Payment Canceled
      </h1>
      <p className="mt-2 text-gray-700">
        Retrying your payment, please wait...
      </p>
      {loading && (
        <p className="mt-4 text-sm text-gray-500 animate-pulse">
          Redirecting to checkout...
        </p>
      )}
    </div>
  );
};

export default CancelPage;
