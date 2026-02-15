'use client'
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const CouponsPage = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAppContext();

  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState(10);
  const [minAmount, setMinAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) return;
    setSaving(true);
    await addCoupon({
      code: code.trim().toUpperCase(),
      type,
      value: Number(value) || 0,
      minAmount: Number(minAmount) || 0,
      isActive: true,
    });
    setCode("");
    setType("percent");
    setValue(10);
    setMinAmount(0);
    setSaving(false);
  };

  const handleToggleActive = (id, current) => {
    updateCoupon(id, { isActive: !current });
  };

  const handleDelete = (id) => {
    deleteCoupon(id);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-6 max-w-4xl w-full">
        <h2 className="text-lg font-medium">Coupons</h2>
        <p className="text-sm text-gray-500">
          Create and manage discount codes that shoppers can apply at checkout.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="coupon-code">
                Code
              </label>
              <input
                id="coupon-code"
                type="text"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                placeholder="e.g. RAYLUX10"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="coupon-type">
                Type
              </label>
              <select
                id="coupon-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40 bg-white"
              >
                <option value="percent">Percent (%)</option>
                <option value="fixed">Fixed amount</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="coupon-value">
                Value
              </label>
              <input
                id="coupon-value"
                type="number"
                min="0"
                step="1"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-28"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="min-amount">
                Minimum order amount
              </label>
              <input
                id="min-amount"
                type="number"
                min="0"
                step="1"
                value={minAmount}
                onChange={(event) => setMinAmount(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-40"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
            >
              {saving ? "Saving..." : "Add coupon"}
            </button>
          </div>
        </form>

        <div className="border rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Code</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Value</th>
                <th className="px-4 py-2 text-left font-medium">
                  Min amount
                </th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-4 text-gray-500 text-center"
                  >
                    No coupons yet. Create one above.
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-t border-gray-100 text-gray-700"
                >
                  <td className="px-4 py-2 font-medium">{coupon.code}</td>
                  <td className="px-4 py-2">
                    {coupon.type === "percent" ? "Percent" : "Fixed amount"}
                  </td>
                  <td className="px-4 py-2">{coupon.value}</td>
                  <td className="px-4 py-2">
                    {coupon.minAmount ? coupon.minAmount : "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        coupon.isActive
                          ? "text-green-600 text-xs font-medium"
                          : "text-gray-400 text-xs"
                      }
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleActive(coupon.id, coupon.isActive)
                      }
                      className="text-xs px-3 py-1 border rounded-full cursor-pointer"
                    >
                      {coupon.isActive ? "Disable" : "Enable"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-xs px-3 py-1 border border-red-500 text-red-600 rounded-full cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CouponsPage;
