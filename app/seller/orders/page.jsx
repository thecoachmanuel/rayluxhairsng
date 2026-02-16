"use client";
import React, { useEffect, useState } from "react";
import { BoxIcon } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const Orders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

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
    }

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

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                <div className="max-w-4xl rounded-md">
                    {orders.map((order, index) => {
                        const rowId = order.id || order._id || index;
                        return (
                        <div key={rowId} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                            <div className="flex-1 flex gap-5 max-w-80">
                                <div className="max-w-16 max-h-16 flex items-center justify-center">
                                    <BoxIcon />
                                </div>
                                <p className="flex flex-col gap-3">
                                    <span className="font-medium">
                                        {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                    </span>
                                    <span>Items : {order.items.length}</span>
                                </p>
                            </div>
                            <div>
                                <p>
                                    <span className="font-medium">{order.address.full_name}</span>
                                    <br />
                                    <span >{order.address.area}</span>
                                    <br />
                                    <span>{`${order.address.city}, ${order.address.state}`}</span>
                                    <br />
                                    <span>{order.address.phone_number}</span>
                                </p>
                            </div>
                                <p className="font-medium my-auto">₦{order.amount}</p>
                            <div className="flex flex-col gap-1 text-sm my-auto min-w-[160px]">
                                <span>Method : {order.payment_method || "Online"}</span>
                                <span>Date : {new Date(order.created_at || order.date).toLocaleDateString()}</span>
                                <div className="flex items-center gap-2">
                                    <span>Status :</span>
                                    <select
                                        value={order.status || "Processing"}
                                        onChange={(event) => handleStatusChange(rowId, event.target.value)}
                                        disabled={updatingOrderId === rowId}
                                        className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
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
                    })}
                </div>
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;
