'use client'
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/supabaseClient";

const CustomersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (supabase) {
        const { data, error } = await supabase
          .from("orders")
          .select("*, address:addresses(*)")
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

  const customers = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const address = order.address;
      if (!address) return;
      const key = `${address.full_name}-${address.phone_number}`;
      if (!map.has(key)) {
        map.set(key, {
          name: address.full_name,
          phone: address.phone_number,
          city: address.city,
          state: address.state,
          area: address.area,
          ordersCount: 1,
          lastOrderDate: order.created_at || order.date,
        });
      } else {
        const existing = map.get(key);
        const nextOrdersCount = existing.ordersCount + 1;
        const lastOrderDate =
          (order.created_at || order.date) > existing.lastOrderDate
            ? order.created_at || order.date
            : existing.lastOrderDate;
        map.set(key, {
          ...existing,
          ordersCount: nextOrdersCount,
          lastOrderDate,
        });
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => b.lastOrderDate - a.lastOrderDate
    );
  }, [orders]);

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-5 max-w-4xl w-full">
        <h2 className="text-lg font-medium">Customers</h2>
        <p className="text-sm text-gray-500">
          Customers derived from recent orders, including their contact and
          location details.
        </p>
        <div className="border rounded-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Name</th>
                <th className="px-4 py-2 text-left font-medium">Phone</th>
                <th className="px-4 py-2 text-left font-medium">Location</th>
                <th className="px-4 py-2 text-left font-medium">Orders</th>
                <th className="px-4 py-2 text-left font-medium">Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-gray-500 text-center"
                  >
                    No customers yet.
                  </td>
                </tr>
              )}
              {customers.map((customer) => (
                <tr
                  key={`${customer.name}-${customer.phone}`}
                  className="border-t border-gray-100 text-gray-700"
                >
                  <td className="px-4 py-2 font-medium">{customer.name}</td>
                  <td className="px-4 py-2">{customer.phone}</td>
                  <td className="px-4 py-2">
                    {customer.city}, {customer.state}
                    <div className="text-xs text-gray-500">{customer.area}</div>
                  </td>
                  <td className="px-4 py-2">{customer.ordersCount}</td>
                  <td className="px-4 py-2">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
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

export default CustomersPage;
