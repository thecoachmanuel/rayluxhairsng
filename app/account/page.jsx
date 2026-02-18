"use client";
import { Suspense, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";

const AccountPageContent = () => {
  const {
    authUser,
    authLoading,
    signIn,
    signUp,
    signOut,
    router,
    membership,
    joinMembership,
    membershipSettings,
    formatCurrency,
  } = useAppContext();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [membershipMessage, setMembershipMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const logMembershipPaymentEvent = async (params) => {
    const { reference, status, errorMessage } = params;
    if (!authUser) {
      return;
    }
    const amount = membershipSettings && typeof membershipSettings.price === "number"
      ? membershipSettings.price
      : 0;
    if (!amount || !supabase) {
      return;
    }
    const payload = {
      reference,
      user_id: authUser.id,
      email: authUser.email || null,
      amount,
      currency: "NGN",
      status,
      gateway: "paystack",
      error_message: errorMessage || null,
    };
    await supabase.from("payments").upsert([payload], { onConflict: "reference" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }
    setSubmitting(true);
    let redirectPath = searchParams.get("redirect") || "/";
    if (!redirectPath.startsWith("/") || redirectPath.startsWith("//")) {
      redirectPath = "/";
    }
    const action = mode === "sign-in" ? signIn : signUp;
    const { error: authError } = await action(email.trim(), password);
    if (authError) {
      setError(authError.message || "Unable to complete request.");
    } else {
      setEmail("");
      setPassword("");
      if (mode === "sign-in") {
        setSuccess("Signed in successfully.");
        router.push(redirectPath);
      } else {
        setSuccess(
          "Account created. Check your email for confirmation if required."
        );
      }
    }
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    setError("");
    setSuccess("");
    await signOut();
  };

  const handleStartMembershipPayment = () => {
    setMembershipMessage("");
    if (!authUser) {
      setMembershipMessage("Sign in to join RayLux VIP.");
      return;
    }
    if (!membershipSettings || !membershipSettings.price || membershipSettings.price <= 0) {
      setMembershipMessage("Membership configuration is missing. Please try again later.");
      return;
    }
    if (typeof window === "undefined" || !window.PaystackPop) {
      setMembershipMessage("Payment system is still loading. Please try again.");
      return;
    }
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setMembershipMessage("Payment configuration is missing. Contact support.");
      return;
    }

    const amountInKobo = Math.round(membershipSettings.price * 100);
    if (amountInKobo <= 0) {
      setMembershipMessage("Membership price must be greater than zero.");
      return;
    }

    setIsPaying(true);
    const ref = `RAYLUX_MEM_${Date.now()}`;

    logMembershipPaymentEvent({ reference: ref, status: "initialized" });

    const paystack = window.PaystackPop.setup({
      key: publicKey,
      email: authUser && authUser.email ? authUser.email : "customer@example.com",
      amount: amountInKobo,
      ref,
      callback: async function (response) {
        const referenceValue = response && response.reference ? response.reference : ref;
        const statusValue = response && response.status ? response.status : "success";
        await logMembershipPaymentEvent({ reference: referenceValue, status: statusValue });
        if (statusValue === "success") {
          const { error } = await joinMembership();
          if (error) {
            setMembershipMessage(
              error.message || "Payment succeeded, but membership could not be activated."
            );
          } else {
            setMembershipMessage("You are now a RayLux VIP member.");
          }
        } else {
          setMembershipMessage("Payment was not successful. Please try again.");
        }
        setIsPaying(false);
      },
      onClose: function () {
        logMembershipPaymentEvent({ reference: ref, status: "closed" });
        setIsPaying(false);
      },
    });
    paystack.openIframe();
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-sm text-gray-600">Loading account...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (authUser) {
    return (
      <>
        <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 py-10 max-w-xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Account</h1>
          <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white">
            <div>
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-base font-medium text-gray-900">
                {authUser.email}
              </p>
            </div>
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleSignOut}
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm cursor-pointer disabled:opacity-60"
              >
                Sign out
              </button>
            </div>
          </div>
          <div className="mt-6 border border-orange-100 rounded-lg p-6 bg-orange-50/60 space-y-3">
            <h2 className="text-base font-semibold text-gray-900">
              {membershipSettings?.title || "RayLux VIP membership"}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {membershipSettings?.subtitle ||
                "Join RayLux VIP to unlock special coupon drops, early access to new textures, and surprise gifts for loyal customers."}
            </p>
            {membershipSettings?.description && (
              <p className="text-xs text-gray-600 leading-relaxed">
                {membershipSettings.description}
              </p>
            )}
            {Array.isArray(membershipSettings?.benefits) &&
              membershipSettings.benefits.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-xs text-gray-700 space-y-1">
                  {membershipSettings.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              )}
            {membershipSettings && (
              <p className="text-xs font-medium text-gray-900 mt-2">
                One-time membership fee: {formatCurrency(membershipSettings.price || 0)}
              </p>
            )}
            {membership && membership.is_active ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-700">
                  You are an active {membership.tier || "VIP"} member.
                </p>
                <p className="text-xs text-gray-600">
                  Watch your email and WhatsApp for exclusive RayLux discount codes.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleStartMembershipPayment}
                  className="px-4 py-2 rounded-md bg-gray-900 hover:bg-black text-white text-sm cursor-pointer"
                >
                  {isPaying ? "Processing payment..." : "Join RayLux VIP"}
                </button>
                <p className="text-xs text-gray-600">
                  Your card will be charged a one-time membership fee. You will
                  receive exclusive coupon codes and early access to new drops as a
                  VIP member.
                </p>
              </div>
            )}
            {membershipMessage && (
              <p className="text-xs text-orange-700 mt-1">{membershipMessage}</p>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-10 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {mode === "sign-in" ? "Sign in" : "Create an account"}
        </h1>
        <div className="border border-gray-200 rounded-lg p-6 bg-white">
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("sign-in");
                setError("");
                setSuccess("");
              }}
              className={`px-3 py-1.5 text-sm rounded-full cursor-pointer ${
                mode === "sign-in"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("sign-up");
                setError("");
                setSuccess("");
              }}
              className={`px-3 py-1.5 text-sm rounded-full cursor-pointer ${
                mode === "sign-up"
                  ? "bg-orange-600 text-white"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              Sign up
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter a secure password"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {success && (
              <p className="text-sm text-green-600">{success}</p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm cursor-pointer disabled:opacity-60"
            >
              {submitting
                ? mode === "sign-in"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "sign-in"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

const AccountPage = () => {
  return (
    <Suspense
      fallback={
        <>
          <Navbar />
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-sm text-gray-600">Loading account...</p>
          </div>
          <Footer />
        </>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
};

export default AccountPage;
