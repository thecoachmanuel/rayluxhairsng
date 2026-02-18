'use client'
import { assets } from "@/assets/assets";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";

const AddAddress = () => {

    const { authUser, authLoading, router } = useAppContext();

    const [address, setAddress] = useState({
        fullName: '',
        phoneNumber: '',
        pincode: '',
        area: '',
        city: '',
        state: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push("/account?redirect=/add-address");
        }
    }, [authLoading, authUser, router]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setError("");
        if (!authUser) {
            setError("Sign in to save an address.");
            return;
        }
        if (!supabase) {
            setError("Address book is currently unavailable. Try again later.");
            return;
        }
        if (!address.fullName.trim() || !address.phoneNumber.trim() || !address.area.trim() || !address.city.trim() || !address.state.trim()) {
            setError("Fill in all required fields.");
            return;
        }
        setSaving(true);
        const payload = {
            user_id: authUser.id,
            full_name: address.fullName.trim(),
            phone_number: address.phoneNumber.trim(),
            pincode: address.pincode.trim(),
            area: address.area.trim(),
            city: address.city.trim(),
            state: address.state.trim(),
        };
        const { error: insertError } = await supabase.from("addresses").insert([payload]);
        if (insertError) {
            setError("Unable to save address. Please try again.");
            setSaving(false);
            return;
        }
        setSaving(false);
        router.push("/checkout");
    };

    return (
        <>
            <Navbar />
				<div className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-16 flex flex-col md:flex-row justify-between">
                <form onSubmit={onSubmitHandler} className="w-full">
                    <p className="text-2xl md:text-3xl text-gray-500">
                        Add Shipping <span className="font-semibold text-orange-600">Address</span>
                    </p>
                    <div className="space-y-3 max-w-sm mt-10">
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Full name"
                            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                            value={address.fullName}
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Phone number"
                            onChange={(e) => setAddress({ ...address, phoneNumber: e.target.value })}
                            value={address.phoneNumber}
                        />
                        <input
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                            type="text"
                            placeholder="Pin code"
                            onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                            value={address.pincode}
                        />
                        <textarea
                            className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500 resize-none"
                            type="text"
                            rows={4}
                            placeholder="Address (Area and Street)"
                            onChange={(e) => setAddress({ ...address, area: e.target.value })}
                            value={address.area}
                        ></textarea>
                        <div className="flex space-x-3">
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="City/District/Town"
                                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                value={address.city}
                            />
                            <input
                                className="px-2 py-2.5 focus:border-orange-500 transition border border-gray-500/30 rounded outline-none w-full text-gray-500"
                                type="text"
                                placeholder="State"
                                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                value={address.state}
                            />
                        </div>
                    </div>
                    {error && (
                        <p className="text-sm text-red-600 mt-3 max-w-sm">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={saving}
                        className="max-w-sm w-full mt-6 bg-orange-600 text-white py-3 hover:bg-orange-700 uppercase disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving..." : "Save address"}
                    </button>
                </form>
                <Image
                    className="md:mr-16 mt-16 md:mt-0"
                    src={assets.my_location_image}
                    alt="my_location_image"
                />
            </div>
            <Footer />
        </>
    );
};

export default AddAddress;
