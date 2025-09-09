"use client";
import React from "react";
import PlanCard from "../Components/PlanCard";

const Plans = () => {
  const plans = [
    {
      title: "الخطة الشهرية",
      duration: "شهر واحد",
      price: "100 جنيه",
    },
    {
      title: "الخطة ربع السنوية",
      duration: "3 أشهر",
      price: "250 جنيه",
    },
    {
      title: "الخطة السنوية",
      duration: "12 شهر",
      price: "900 جنيه",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">الخطط</h2>

      {/* شبكة الخطط */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <PlanCard
            key={index}
            title={plan.title}
            duration={plan.duration}
            price={plan.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Plans;
