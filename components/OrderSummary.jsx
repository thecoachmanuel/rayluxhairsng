import { addressDummyData } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useMemo, useState } from "react";

const OrderSummary = () => {

  const {
    currency,
    router,
    getCartCount,
    getCartAmount,
    shippingSettings,
    coupons,
  } = useAppContext();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const fetchUserAddresses = async () => {
    setUserAddresses(addressDummyData);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {

  }

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
        `Minimum order amount for this coupon is ${currency}${coupon.minAmount}.`
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

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
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
              {currency}
              {subtotal}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">
              {shippingFee === 0 ? "Free" : `${currency}${shippingFee}`}
            </p>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between">
              <p className="text-gray-600">
                Coupon discount{appliedCoupon ? ` (${appliedCoupon.code})` : ""}
              </p>
              <p className="font-medium text-gray-800">
                -{currency}
                {discountAmount}
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">
              {currency}
              {tax}
            </p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>
              {currency}
              {total}
            </p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;
