"use client";
import React, { useEffect, useState } from "react";
import { BoxIcon, assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {

    const { currency, formatCurrency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("All");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const fetchSellerOrders = async () => {
        if (supabase) {
            const { data, error } = await supabase
                .from("orders")
                .select("*, address:addresses(*), items:order_items(*, product:products(*))")
                .order("created_at", { ascending: false });
            if (!error && Array.isArray(data)) {
                setOrders(data);
                setLoading(false);
                return;
            }
        }
        setOrders([]);
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        if (!supabase) return;
        setUpdatingOrderId(orderId);
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus })
            .eq("id", orderId);
        if (!error) {
            setOrders((prev) =>
                prev.map((order) =>
                    (order.id || order._id) === orderId
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        }
        setUpdatingOrderId(null);
    };

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filteredOrders = orders.filter((order, index) => {
        const status = order.status || "Processing";
        const matchesStatus = statusFilter === "All" || status === statusFilter;
        if (!matchesStatus) {
            return false;
        }

        const payment = (order.payment_method || "Online").toLowerCase();
        const matchesPayment =
            paymentFilter === "All" ||
            (paymentFilter === "Online" && payment === "online") ||
            (paymentFilter === "Transfer" && payment === "transfer") ||
            (paymentFilter === "Card" && payment === "card");
        if (!matchesPayment) {
            return false;
        }

        if (fromDate || toDate) {
            const orderTime = new Date(order.created_at || order.date).getTime();
            if (Number.isFinite(orderTime)) {
                if (fromDate) {
                    const fromTime = new Date(fromDate).getTime();
                    if (Number.isFinite(fromTime) && orderTime < fromTime) {
                        return false;
                    }
                }
                if (toDate) {
                    const toTime = new Date(toDate).getTime();
                    if (Number.isFinite(toTime) && orderTime > toTime) {
                        return false;
                    }
                }
            }
        }

        if (!normalizedSearch) {
            return true;
        }
        const rowId = (order.id || order._id || index).toString();
        const fullName = order.address?.full_name || "";
        const phone = order.address?.phone_number || "";
        return (
            rowId.toLowerCase().includes(normalizedSearch) ||
            fullName.toLowerCase().includes(normalizedSearch) ||
            phone.toLowerCase().includes(normalizedSearch)
        );
    });

    const totalOrders = orders.length;
    const openOrders = orders.filter((order) => {
        const status = order.status || "Processing";
        return status !== "Delivered" && status !== "Cancelled";
    }).length;
    const totalRevenue = orders.reduce((sum, order) => {
        const amount = Number(order.amount) || 0;
        return sum + amount;
    }, 0);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : (
                <div className="md:p-10 p-4 space-y-5">
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-medium">Orders</h2>
                        <div className="grid gap-3 md:grid-cols-3 max-w-4xl">
                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Total orders</span>
                                <span className="text-sm font-semibold text-gray-900">{totalOrders}</span>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Open orders</span>
                                <span className="text-sm font-semibold text-gray-900">{openOrders}</span>
                            </div>
                            <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex items-center justify-between">
                                <span className="text-xs text-gray-500">Total revenue</span>
                                <span className="text-sm font-semibold text-gray-900">{formatCurrency(totalRevenue)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between max-w-4xl">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Status</span>
                                        <select
                                            value={statusFilter}
                                            onChange={(event) => setStatusFilter(event.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                                        >
                                            <option value="All">All</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">Payment</span>
                                        <select
                                            value={paymentFilter}
                                            onChange={(event) => setPaymentFilter(event.target.value)}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
                                        >
                                            <option value="All">All</option>
                                            <option value="Online">Online</option>
                                            <option value="Transfer">Transfer</option>
                                            <option value="Card">Card</option>
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
                                        placeholder="Search by customer, phone, or order ID"
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
                    <div className="mt-6 max-w-4xl rounded-md border-t border-gray-200">
                        {filteredOrders.length === 0 ? (
                            <div className="py-6 text-center text-gray-500 text-sm">
                                No orders match the selected filters.
                            </div>
                        ) : (
                            filteredOrders.map((order, index) => {
                                const rowId = order.id || order._id || index;
                                const status = order.status || "Processing";
                                const amount = Number(order.amount) || 0;
                                return (
                                    <div
                                        key={rowId}
                                        className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-200"
                                    >
                                        <div className="flex-1 flex gap-5 max-w-80">
                                            <div className="w-10 h-10 rounded-md bg-orange-50 flex items-center justify-center text-orange-600">
                                                <BoxIcon />
                                            </div>
                                            <p className="flex flex-col gap-2">
                                                <span className="font-medium">
                                                    {order.items
                                                        .map((item) => item.product.name + ` x ${item.quantity}`)
                                                        .join(", ")}
                                                </span>
                                                <span className="text-xs text-gray-500">Items: {order.items.length}</span>
                                                <span className="text-[11px] text-gray-400">Order ID: {rowId}</span>
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-700 min-w-[160px]">
                                            <p>
                                                <span className="font-medium">{order.address.full_name}</span>
                                                <br />
                                                <span>{order.address.area}</span>
                                                <br />
                                                <span>{`${order.address.city}, ${order.address.state}`}</span>
                                                <br />
                                                <span>{order.address.phone_number}</span>
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1 text-xs my-auto min-w-[150px] items-end">
                                            <span className="font-semibold text-sm">{formatCurrency(amount)}</span>
                                            <span className="text-gray-500">Method: {order.payment_method || "Online"}</span>
                                            <span className="text-gray-500">Date: {new Date(order.created_at || order.date).toLocaleDateString()}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-gray-500">Status:</span>
                                                <select
                                                    value={status}
                                                    onChange={(event) => handleStatusChange(rowId, event.target.value)}
                                                    disabled={updatingOrderId === rowId}
                                                    className="border border-gray-300 rounded-md px-2 py-1 text-[11px] bg-white outline-none"
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default Orders;
