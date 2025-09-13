"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const CancelPage = () => {
    const searchParams = useSearchParams();
    const pendingId = searchParams.get("pendingId");
    const [loading, setLoading] = useState(false);

    const handleRetryPayment = async () => {
        if (!pendingId) return;
        setLoading(true);
        try {
            const res = await axios.post(
                `https://class-room-backend-nodejs.vercel.app/api/payment/re-payment`,
                { pendingId }
            );
            window.location.href = res.data.url; // redirect to new checkout session
        } catch (err) {
            console.error("Retry error:", err);
            setLoading(false);
        }
    };

    useEffect(() => {
        // auto start retry when page loads
        if (pendingId) {
            handleRetryPayment();
        }
    }, [pendingId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
            <h1 className="text-2xl font-bold text-red-600">
                ❌ Payment Canceled
            </h1>
            <p className="mt-2 text-gray-700">
                Retrying your payment, please wait...
            </p>
            {!loading && (
                <button
                    onClick={handleRetryPayment}
                    className="mt-4 px-4 py-2 bg-[#1998e1] text-white rounded-lg shadow hover:bg-[#127bbf] transition"
                >
                    Retry Payment
                </button>
            )}
        </div>
    );
};

export default CancelPage;
