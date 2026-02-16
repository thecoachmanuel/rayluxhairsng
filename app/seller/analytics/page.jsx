'use client'
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";
import { useAppContext } from "@/context/AppContext";

const AnalyticsPage = () => {
  const { currency } = useAppContext();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, items:order_items(*, product:products(*))")
          .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
          setOrders(data);
          return;
        }
      }
      setOrders([]);
    };
    fetchOrders();
  }, []);

  const summary = useMemo(() => {
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );
    const totalOrders = orders.length;

    const byStatus = {};
    const byCategory = {};

    orders.forEach((order) => {
      const status = order.status || "Unknown";
      byStatus[status] = (byStatus[status] || 0) + 1;

      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const category =
            item.product && item.product.category
              ? item.product.category
              : "Other";
          byCategory[category] = (byCategory[category] || 0) + 1;
        });
      }
    });

    return {
      totalRevenue,
      totalOrders,
      byStatus,
      byCategory,
    };
  }, [orders]);

  const statusEntries = Object.entries(summary.byStatus);
  const categoryEntries = Object.entries(summary.byCategory);
  const maxCategoryCount = Math.max(
    1,
    ...categoryEntries.map((entry) => entry[1])
  );

  const handleExportCsv = () => {
    const headers = [
      "Order ID",
      "Date",
      "Status",
      "Amount",
      "Customer",
      "City",
      "State",
    ];
    const rows = orders.map((order) => [
      order.id || order._id,
      new Date(order.created_at || order.date).toISOString(),
      order.status,
      order.amount,
      order.address_full_name || "",
      order.address_city || "",
      order.address_state || "",
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "raylux-analytics-orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportPrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <title>RayLux Hairs Analytics</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
            th { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>RayLux Hairs Analytics</h1>
						<p><strong>Total revenue:</strong> ₦${summary.totalRevenue.toFixed(
							2
						)}</p>
          <p><strong>Total orders:</strong> ${summary.totalOrders}</p>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Customer</th>
                <th>City</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .map(
                  (order) => `
                  <tr>
                    <td>${order.id || order._id}</td>
                    <td>${new Date(
                      order.created_at || order.date
                    ).toLocaleString()}</td>
                    <td>${order.status}</td>
                    <td>${order.amount}</td>
                    <td>${order.address_full_name || ""}</td>
                    <td>${order.address_city || ""}</td>
                    <td>${order.address_state || ""}</td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-6 max-w-5xl w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Analytics</h2>
            <p className="text-sm text-gray-500">
              Overview based on recent RayLux Hairs orders.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-4 py-2 border rounded text-xs cursor-pointer"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={handleExportPrint}
              className="px-4 py-2 border rounded text-xs cursor-pointer"
            >
              Export PDF
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4">
            <p className="text-xs text-gray-500">Total revenue</p>
            <p className="mt-2 text-xl font-semibold">
              {currency}
              {summary.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="border rounded-md p-4">
            <p className="text-xs text-gray-500">Total orders</p>
            <p className="mt-2 text-xl font-semibold">
              {summary.totalOrders}
            </p>
          </div>
          <div className="border rounded-md p-4">
            <p className="text-xs text-gray-500">Average order value</p>
            <p className="mt-2 text-xl font-semibold">
              {currency}
              {summary.totalOrders
                ? (summary.totalRevenue / summary.totalOrders).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <p className="text-sm font-medium mb-4">Orders by status</p>
            <div className="space-y-2">
              {statusEntries.map(([status, count]) => {
                const percentage = summary.totalOrders
                  ? Math.round((count / summary.totalOrders) * 100)
                  : 0;
                return (
                  <div key={status} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{status}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {statusEntries.length === 0 && (
                <p className="text-xs text-gray-500">
                  No order data available yet.
                </p>
              )}
            </div>
          </div>

          <div className="border rounded-md p-4">
            <p className="text-sm font-medium mb-4">Orders by category</p>
            <div className="space-y-3">
              {categoryEntries.map(([category, count]) => {
                const width = Math.round((count / maxCategoryCount) * 100);
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{category}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded">
                      <div
                        className="h-full bg-orange-500 rounded"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              {categoryEntries.length === 0 && (
                <p className="text-xs text-gray-500">
                  No category data available yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
