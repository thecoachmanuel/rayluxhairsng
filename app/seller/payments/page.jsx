"use client";
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";
import Image from "next/image";

const PaymentsPage = () => {
  const { formatCurrency } = useAppContext();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [gatewayFilter, setGatewayFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from("payments")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          setPayments(data);
          setLoading(false);
          return;
        }
      }
      setPayments([]);
      setLoading(false);
    };
    fetchPayments();
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const status = payment.status || "unknown";
      const gateway = payment.gateway || "paystack";
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      if (!matchesStatus) {
        return false;
      }
      const matchesGateway =
        gatewayFilter === "All" || gateway.toLowerCase() === gatewayFilter.toLowerCase();
      if (!matchesGateway) {
        return false;
      }
      if (fromDate || toDate) {
        const ts = new Date(payment.created_at).getTime();
        if (Number.isFinite(ts)) {
          if (fromDate) {
            const fromTs = new Date(fromDate).getTime();
            if (Number.isFinite(fromTs) && ts < fromTs) {
              return false;
            }
          }
          if (toDate) {
            const toTs = new Date(toDate).getTime();
            if (Number.isFinite(toTs) && ts > toTs) {
              return false;
            }
          }
        }
      }
      if (!normalizedSearch) {
        return true;
      }
      const email = payment.email || "";
      const reference = payment.reference || "";
      const userId = payment.user_id || "";
      return (
        email.toLowerCase().includes(normalizedSearch) ||
        reference.toLowerCase().includes(normalizedSearch) ||
        String(userId).toLowerCase().includes(normalizedSearch)
      );
    });
  }, [payments, statusFilter, gatewayFilter, fromDate, toDate, normalizedSearch]);

  const summary = useMemo(() => {
    const totalCount = payments.length;
    const successCount = payments.filter((p) => p.status === "success").length;
    const failedCount = payments.filter((p) => p.status && p.status !== "success").length;
    const totalAmount = payments.reduce((sum, p) => {
      const amount = Number(p.amount) || 0;
      return sum + amount;
    }, 0);
    const successfulAmount = payments.reduce((sum, p) => {
      if (p.status === "success") {
        const amount = Number(p.amount) || 0;
        return sum + amount;
      }
      return sum;
    }, 0);

    const membershipPayments = payments.filter((p) => {
      const ref = p.reference || "";
      return ref.startsWith("RAYLUX_MEM_");
    });
    const membershipCount = membershipPayments.length;
    const membershipSuccessCount = membershipPayments.filter(
      (p) => p.status === "success"
    ).length;
    const membershipSuccessfulAmount = membershipPayments.reduce((sum, p) => {
      if (p.status === "success") {
        const amount = Number(p.amount) || 0;
        return sum + amount;
      }
      return sum;
    }, 0);

    return {
      totalCount,
      successCount,
      failedCount,
      totalAmount,
      successfulAmount,
      membershipCount,
      membershipSuccessCount,
      membershipSuccessfulAmount,
    };
  }, [payments]);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      <div className="md:p-10 p-4 space-y-5">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-medium">Payments</h2>
          <div className="grid gap-3 md:grid-cols-4 max-w-5xl">
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Total attempts</span>
              <span className="text-sm font-semibold text-gray-900">{summary.totalCount}</span>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Successful</span>
              <span className="text-sm font-semibold text-gray-900">{summary.successCount}</span>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Failed / closed</span>
              <span className="text-sm font-semibold text-gray-900">{summary.failedCount}</span>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex flex-col gap-1">
              <span className="text-xs text-gray-500">Successful volume</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(summary.successfulAmount)}
              </span>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3 max-w-5xl">
            <div className="border border-gray-200 rounded-md p-3 bg-white flex flex-col gap-1">
              <span className="text-xs text-gray-500">Membership payments</span>
              <span className="text-sm font-semibold text-gray-900">
                {summary.membershipCount}
                {summary.membershipCount > 0 &&
                  ` (${summary.membershipSuccessCount} successful)`}
              </span>
            </div>
            <div className="border border-gray-200 rounded-md p-3 bg-white flex flex-col gap-1">
              <span className="text-xs text-gray-500">Membership revenue</span>
              <span className="text-sm font-semibold text-gray-900">
                {formatCurrency(summary.membershipSuccessfulAmount)}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between max-w-5xl">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                  >
                    <option value="All">All</option>
                    <option value="initialized">Initialized</option>
                    <option value="success">Success</option>
                    <option value="failed">Failed</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Gateway</span>
                  <select
                    value={gatewayFilter}
                    onChange={(event) => setGatewayFilter(event.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                  >
                    <option value="All">All</option>
                    <option value="paystack">Paystack</option>
                  </select>
                </div>
              </div>
              <div className="relative max-w-xs w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Image src={assets.search_icon} alt="search_icon" className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by email, reference, or user ID"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 max-w-5xl rounded-md border-t border-gray-200">
          {loading ? (
            <div className="py-6 text-center text-gray-500 text-sm">Loading payments...</div>
          ) : filteredPayments.length === 0 ? (
            <div className="py-6 text-center text-gray-500 text-sm">
              No payments match the selected filters.
            </div>
          ) : (
            filteredPayments.map((payment) => {
              const amount = Number(payment.amount) || 0;
              const isMembership = (payment.reference || "").startsWith("RAYLUX_MEM_");
              return (
                <div
                  key={payment.id || payment.reference}
                  className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-200"
                >
                  <div className="flex-1 flex gap-4 max-w-xl">
                    <div className="w-9 h-9 rounded-md bg-orange-50 flex items-center justify-center text-orange-600">
                      <span className="text-[11px] font-semibold">NGN</span>
                    </div>
                    <div className="flex flex-col gap-1 text-xs">
                      <span className="font-semibold text-sm">{formatCurrency(amount)}</span>
                      <span className="text-gray-500">{payment.email || "Unknown email"}</span>
                      <span className="text-[11px] text-gray-400">Ref: {payment.reference}</span>
                      {isMembership && (
                        <span className="inline-flex mt-0.5 px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-medium w-fit">
                          Membership
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 text-xs min-w-[160px] items-end">
                    <span className="text-gray-500">User ID: {payment.user_id}</span>
                    <span className="text-gray-500">Gateway: {payment.gateway || "paystack"}</span>
                    <span className="text-gray-500">
                      Date: {new Date(payment.created_at).toLocaleString()}
                    </span>
                    <span
                      className={
                        payment.status === "success"
                          ? "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-green-100 text-green-700"
                          : payment.status === "failed"
                          ? "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-100 text-red-700"
                          : payment.status === "initialized"
                          ? "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-100 text-yellow-700"
                          : "mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700"
                      }
                    >
                      {payment.status || "unknown"}
                    </span>
                    {payment.error_message && (
                      <span className="text-[11px] text-red-500 max-w-xs text-right truncate">
                        {payment.error_message}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
