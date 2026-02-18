"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

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
  } = useAppContext();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [membershipMessage, setMembershipMessage] = useState("");

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

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center pt-20 md:pt-24">
          <p className="text-sm text-gray-600">Loading account...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (authUser) {
    return (
      <>
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10 max-w-xl mx-auto">
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
              RayLux VIP membership
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Join RayLux VIP to unlock special coupon drops, early access to new
              textures, and surprise gifts for loyal customers.
            </p>
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
                  onClick={async () => {
                    setMembershipMessage("");
                    const { error } = await joinMembership();
                    if (error) {
                      setMembershipMessage(
                        error.message || "Unable to join membership right now."
                      );
                    } else {
                      setMembershipMessage("You are now a RayLux VIP member.");
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-gray-900 hover:bg-black text-white text-sm cursor-pointer"
                >
                  Join RayLux VIP
                </button>
                <p className="text-xs text-gray-600">
                  Membership is free. You will receive special coupon codes like
                  <span className="font-semibold"> RAYLUXVIP</span> for huge
                  discounts during campaigns.
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
      <div className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10 max-w-xl mx-auto">
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
