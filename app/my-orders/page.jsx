"use client";
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";
import { supabase } from "@/supabaseClient";

const MyOrders = () => {

    const { currency, authUser, authLoading, router } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        if (!supabase || !authUser) {
            setOrders([]);
            setLoading(false);
            return;
        }
        const { data, error } = await supabase
            .from("orders")
            .select("*, address:addresses(*), items:order_items(*, product:products(*))")
            .eq("userId", authUser.id)
            .order("created_at", { ascending: false });
        if (!error && Array.isArray(data)) {
            setOrders(data);
        } else {
            setOrders([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!authLoading) {
            if (!authUser) {
                router.push("/account?redirect=/my-orders");
                return;
            }
            fetchOrders();
        }
    }, [authLoading, authUser]);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (<div className="max-w-5xl border-t border-gray-300 text-sm">
                        {orders.length === 0 && (
                            <div className="py-6 text-center text-gray-500 text-sm">
                                You do not have any orders yet.
                            </div>
                        )}
                        {orders.map((order) => (
                            <div key={order.id || order._id} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium text-base">
                                            {order.items.map((item) => item.product.name + ` x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                    </p>
                                </div>
                                <div>
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
                                <p className="font-medium my-auto">₦{order.amount}</p>
                                <div>
                                    <p className="flex flex-col">
                                        <span>Method : {order.payment_method || "Online"}</span>
                                        <span>Date : {new Date(order.created_at || order.date).toLocaleDateString()}</span>
                                        <span>Status : {order.status || "Processing"}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>)}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;
