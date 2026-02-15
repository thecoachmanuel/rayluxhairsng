'use client';
import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import OrderSummary from "@/components/OrderSummary";
import { useAppContext } from "@/context/AppContext";

const CheckoutPage = () => {
  const { authUser, authLoading, router } = useAppContext();

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push(`/account?redirect=${encodeURIComponent("/checkout")}`);
    }
  }, [authLoading, authUser, router]);

  if (authLoading || (!authUser && typeof window !== "undefined")) {
    return (
      <>
        <Navbar />
        <div className="min-h-[50vh] flex items-center justify-center">
          <p className="text-sm text-gray-600">Redirecting to sign in...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 pt-14 mb-20 flex flex-col items-center">
        <div className="w-full md:max-w-xl">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
            Checkout
          </h1>
          <OrderSummary />
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;

