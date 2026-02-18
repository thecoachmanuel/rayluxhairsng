"use client";
import React, { useState } from "react";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";

const MembershipPage = () => {
  const {
    authUser,
    router,
    membership,
    joinMembership,
    membershipSettings,
    formatCurrency,
  } = useAppContext();

  const [isPaying, setIsPaying] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayWithPaystack = () => {
    setMessage("");
    if (!authUser) {
      setMessage("Sign in to join RayLux VIP membership.");
      router.push("/account?redirect=/membership");
      return;
    }
    const amount = membershipSettings.price || 0;
    if (!amount || amount <= 0) {
      setMessage("Membership price is not configured. Please try again later.");
      return;
    }
    if (typeof window === "undefined" || !window.PaystackPop) {
      setMessage("Payment system is still loading. Please try again.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setMessage("Payment configuration is missing. Contact support.");
      return;
    }
    setIsPaying(true);
    const amountInKobo = Math.round(amount * 100);
    const ref = `RAYLUX_MEM_${Date.now()}`;

    const logMembershipPayment = async (params) => {
      if (!supabase || !authUser) {
        return;
      }
      const payload = {
        reference: params.reference,
        user_id: authUser.id,
        email: authUser.email || null,
        amount: amount,
        currency: "NGN",
        status: params.status,
        gateway: "paystack-membership",
        error_message: params.errorMessage || null,
      };
      await supabase
        .from("payments")
        .upsert([payload], { onConflict: "reference" });
    };

    let completed = false;
    const paystack = window.PaystackPop.setup({
      key: publicKey,
      email: authUser.email || "customer@example.com",
      amount: amountInKobo,
      ref,
      callback: function (response) {
        const referenceValue =
          response && response.reference ? response.reference : ref;
        const statusValue =
          response && response.status ? response.status : "success";
        if (statusValue === "success") {
          completed = true;
        }
        logMembershipPayment({
          reference: referenceValue,
          status: statusValue,
        });
        if (statusValue === "success") {
          joinMembership()
            .then(({ error }) => {
              if (error) {
                setMessage(
                  error.message ||
                    "Payment succeeded, but membership could not be activated."
                );
              } else {
                setMessage("You are now a RayLux VIP member.");
              }
              setIsPaying(false);
            })
            .catch(() => {
              setMessage(
                "Payment succeeded, but membership could not be activated."
              );
              setIsPaying(false);
            });
        } else {
          setMessage("Payment was not successful. Please try again.");
          setIsPaying(false);
        }
      },
      onClose: function () {
        if (!completed) {
          logMembershipPayment({ reference: ref, status: "closed" });
        }
        setIsPaying(false);
      },
    });
    paystack.openIframe();
  };

  const benefitsText = membershipSettings.benefits;
  const priceLabel =
    membershipSettings.price && membershipSettings.price > 0
      ? formatCurrency(membershipSettings.price)
      : "Set by admin";

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10 max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
          RayLux VIP membership
        </h1>
        <p className="text-sm text-gray-600 mb-6">{benefitsText}</p>

        <div className="border border-gray-200 rounded-lg p-5 bg-white space-y-4">
          <p className="text-sm text-gray-700">
            Membership price:
            <span className="font-semibold ml-1">{priceLabel}</span>
          </p>
          {membership && membership.is_active ? (
            <p className="text-sm font-medium text-green-700">
              You are an active {membership.tier || "VIP"} member.
            </p>
          ) : (
            <button
              type="button"
              onClick={handlePayWithPaystack}
              disabled={isPaying}
              className="px-6 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm cursor-pointer disabled:opacity-70"
            >
              {isPaying ? "Processing payment..." : "Pay with Paystack"}
            </button>
          )}
          {message && (
            <p className="text-xs text-orange-700 mt-1">{message}</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MembershipPage;

