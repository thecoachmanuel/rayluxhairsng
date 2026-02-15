"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AccountPage = () => {
  const {
    authUser,
    authLoading,
    signIn,
    signUp,
    signOut,
    router,
  } = useAppContext();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

export default AccountPage;
