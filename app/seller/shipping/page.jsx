'use client'
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const ShippingSettingsPage = () => {
  const { shippingSettings, updateShippingSettings, currency } =
    useAppContext();

  const [baseFee, setBaseFee] = useState(0);
  const [perItemFee, setPerItemFee] = useState(0);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBaseFee(shippingSettings.baseFee || 0);
    setPerItemFee(shippingSettings.perItemFee || 0);
    setFreeShippingThreshold(shippingSettings.freeShippingThreshold || 0);
  }, [shippingSettings]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    updateShippingSettings({
      baseFee: Number(baseFee) || 0,
      perItemFee: Number(perItemFee) || 0,
      freeShippingThreshold: Number(freeShippingThreshold) || 0,
    });
    setSaving(false);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-xl w-full"
      >
        <h2 className="text-lg font-medium">Shipping & fees</h2>
        <p className="text-sm text-gray-500">
          Control shipping fees used on the RayLux Hairs checkout. All values
          are stored locally in this browser.
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="base-fee">
            Base shipping fee
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">{currency}</span>
            <input
              id="base-fee"
              type="number"
              min="0"
              step="1"
              value={baseFee}
              onChange={(event) => setBaseFee(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
            />
          </div>
          <p className="text-xs text-gray-500">
            Flat fee added to every order when below the free shipping
            threshold.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="per-item-fee">
            Per item fee
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">{currency}</span>
            <input
              id="per-item-fee"
              type="number"
              min="0"
              step="1"
              value={perItemFee}
              onChange={(event) => setPerItemFee(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
            />
          </div>
          <p className="text-xs text-gray-500">
            Multiplied by the number of items in the cart.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-sm font-medium"
            htmlFor="free-shipping-threshold"
          >
            Free shipping threshold
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">{currency}</span>
            <input
              id="free-shipping-threshold"
              type="number"
              min="0"
              step="1"
              value={freeShippingThreshold}
              onChange={(event) => setFreeShippingThreshold(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
            />
          </div>
          <p className="text-xs text-gray-500">
            Orders equal or above this amount get free shipping. Set to 0 to
            disable.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save shipping settings"}
        </button>
      </form>
    </div>
  );
};

export default ShippingSettingsPage;

