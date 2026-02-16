import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { supabase } from "@/supabaseClient";

const OrderSummary = () => {

	const {
		currency,
		router,
		authUser,
		products,
		cartItems,
		setCartItems,
		getCartCount,
		getCartAmount,
		shippingSettings,
		coupons,
		formatCurrency,
	} = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [isPaying, setIsPaying] = useState(false);

	const fetchUserAddresses = async () => {
		if (supabase && authUser) {
			const { data, error } = await supabase
				.from("addresses")
				.select("*")
				.eq("user_id", authUser.id)
				.order("created_at", { ascending: false });
			if (!error && Array.isArray(data)) {
				const mapped = data.map((row) => ({
					id: row.id,
					fullName: row.full_name,
					phoneNumber: row.phone_number,
					pincode: row.pincode,
					area: row.area,
					city: row.city,
					state: row.state,
				}));
				setUserAddresses(mapped);
				return;
			}
		}
		setUserAddresses(addressDummyData);
	};

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

	const createOrder = async (paystackReference) => {
		if (!supabase) {
			setCouponMessage(
				"Payment succeeded, but the order system is offline. Please contact support with your payment reference."
			);
			return Promise.reject(new Error("Supabase not configured"));
		}
		if (!authUser) {
			setCouponMessage(
				"Payment succeeded, but we could not link this order to your account. Please sign in and contact support with your payment reference."
			);
			return Promise.reject(new Error("User not authenticated"));
		}
		if (!selectedAddress) {
			setCouponMessage("Select a delivery address before paying.");
			return Promise.reject(new Error("No address selected"));
		}
		const cartProductIds = Object.keys(cartItems || {});
		if (cartProductIds.length === 0) {
			setCouponMessage("Your cart is empty.");
			return Promise.reject(new Error("Cart is empty"));
		}
		let addressId = selectedAddress.id;
		if (!addressId) {
			const addressPayload = {
				user_id: authUser.id,
				full_name: selectedAddress.fullName,
				phone_number: selectedAddress.phoneNumber,
				pincode: selectedAddress.pincode,
				area: selectedAddress.area,
				city: selectedAddress.city,
				state: selectedAddress.state,
			};
			const { data: addressRow, error: addressError } = await supabase
				.from("addresses")
				.insert([addressPayload])
				.select("*")
				.single();
			if (addressError || !addressRow) {
				setCouponMessage(
					"Payment succeeded, but we could not save your address. Please contact support with your payment reference."
				);
				return Promise.reject(addressError || new Error("Address insert failed"));
			}
			addressId = addressRow.id;
		}
		const orderPayload = {
			userId: authUser.id,
			amount: total,
			status: "Processing",
			payment_method: "Paystack",
			address_id: addressId,
		};
		const { data: orderRow, error: orderError } = await supabase
			.from("orders")
			.insert([orderPayload])
			.select("*")
			.single();
		if (orderError || !orderRow) {
			setCouponMessage(
				"Payment succeeded, but we could not save your order. Please contact support with your payment reference."
			);
			return Promise.reject(orderError || new Error("Order insert failed"));
		}
		const itemsPayload = [];
		cartProductIds.forEach((productId) => {
			const quantity = cartItems[productId];
			if (!quantity || quantity <= 0) {
				return;
			}
			const product = products.find(
				(item) => item._id === productId || String(item.id) === String(productId)
			);
			if (!product) {
				return;
			}
			const productRowId = product.id || product._id;
			itemsPayload.push({
				order_id: orderRow.id,
				product_id: productRowId,
				quantity,
			});
		});
		if (itemsPayload.length > 0) {
			const { error: itemsError } = await supabase
				.from("order_items")
				.insert(itemsPayload);
			if (itemsError) {
				setCouponMessage(
					"Payment succeeded, but some items were not recorded. Please contact support with your payment reference."
				);
				return Promise.reject(itemsError);
			}
		}
		setCartItems({});
		return orderRow;
	};

	const cartCount = getCartCount();
	const cartAmount = getCartAmount();

  const shippingFee = useMemo(() => {
    if (cartAmount <= 0) return 0;
    const base = shippingSettings.baseFee || 0;
    const perItem = shippingSettings.perItemFee || 0;
    const threshold = shippingSettings.freeShippingThreshold || 0;
    if (threshold > 0 && cartAmount >= threshold) {
      return 0;
    }
    return base + perItem * cartCount;
  }, [cartAmount, cartCount, shippingSettings]);

	const handleApplyCoupon = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage("Enter a coupon code.");
      return;
    }
    const coupon = coupons.find(
      (item) =>
        item.isActive &&
        item.code &&
        item.code.toUpperCase() === code
    );
    if (!coupon) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMessage("Coupon not found or inactive.");
      return;
    }
    if (coupon.minAmount && cartAmount < coupon.minAmount) {
      setAppliedCoupon(null);
      setDiscountAmount(0);
			setCouponMessage(
				`Minimum order amount for this coupon is ${formatCurrency(coupon.minAmount)}.`
			);
      return;
    }

    let discount = 0;
    if (coupon.type === "percent") {
      discount = Math.floor((cartAmount * coupon.value) / 100);
    } else if (coupon.type === "fixed") {
      discount = coupon.value;
    }
    if (discount > cartAmount) {
      discount = cartAmount;
    }

    setAppliedCoupon(coupon);
    setDiscountAmount(discount);
    setCouponMessage("Coupon applied.");
  };

	const subtotal = cartAmount;
	const totalBeforeTax = subtotal - discountAmount + shippingFee;
	const tax = Math.floor(totalBeforeTax * 0.02);
	const total = totalBeforeTax + tax;

	const handlePayWithPaystack = () => {
		if (!selectedAddress) {
			setCouponMessage("Select a delivery address before paying.");
			return;
		}
		if (total <= 0) {
			setCouponMessage("Add items to your cart before paying.");
			return;
		}
		if (typeof window === "undefined" || !window.PaystackPop) {
			setCouponMessage("Payment system is still loading. Please try again.");
			return;
		}
		const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
		if (!publicKey) {
			setCouponMessage("Payment configuration is missing. Contact support.");
			return;
		}
		setIsPaying(true);
		const amountInKobo = Math.round(total * 100);
		const ref = `RAYLUX_${Date.now()}`;
		const paystack = window.PaystackPop.setup({
			key: publicKey,
			email: authUser && authUser.email ? authUser.email : "customer@example.com",
			amount: amountInKobo,
			ref,
			callback: function (response) {
				createOrder(response && response.reference ? response.reference : ref)
					.then(() => {
						setIsPaying(false);
						router.push("/order-placed");
					})
					.catch(() => {
						setIsPaying(false);
					});
			},
			onClose: function () {
				setIsPaying(false);
			},
		});
		paystack.openIframe();
	};

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
		<>
			<Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
			<div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(event) => setPromoCode(event.target.value)}
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700 cursor-pointer"
            >
              Apply
            </button>
            {couponMessage && (
              <p className="text-xs text-gray-500">{couponMessage}</p>
            )}
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
			<div className="flex justify-between text-base font-medium">
				<p className="uppercase text-gray-600">Items {cartCount}</p>
				<p className="text-gray-800">
					{formatCurrency(subtotal)}
				</p>
			</div>
			<div className="flex justify-between">
				<p className="text-gray-600">Shipping Fee</p>
				<p className="font-medium text-gray-800">
					{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}
				</p>
			</div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <p className="text-gray-600">
                Coupon discount{appliedCoupon ? ` (${appliedCoupon.code})` : ""}
              </p>
						<p className="font-medium text-gray-800">
							- {formatCurrency(discountAmount)}
						</p>
            </div>
          )}
			<div className="flex justify-between">
				<p className="text-gray-600">Tax (2%)</p>
				<p className="font-medium text-gray-800">
					{formatCurrency(tax)}
				</p>
			</div>
			<div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
				<p>Total</p>
				<p>
					{formatCurrency(total)}
				</p>
			</div>
        </div>
      </div>

				<button
					onClick={handlePayWithPaystack}
					disabled={isPaying}
					className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700 disabled:opacity-70 disabled:cursor-not-allowed"
				>
					{isPaying ? "Processing payment..." : "Pay with Paystack"}
				</button>
			</div>
		</>
		);
};

export default OrderSummary;
