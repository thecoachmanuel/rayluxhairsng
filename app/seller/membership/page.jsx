"use client";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";

const MembershipSettingsPage = () => {
  const { membershipSettings, updateMembershipSettings, currency } = useAppContext();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [benefitsText, setBenefitsText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!membershipSettings) {
      return;
    }
    setTitle(membershipSettings.title || "");
    setSubtitle(membershipSettings.subtitle || "");
    setDescription(membershipSettings.description || "");
    setPrice(membershipSettings.price || 0);
    if (Array.isArray(membershipSettings.benefits)) {
      setBenefitsText(membershipSettings.benefits.join("\n"));
    }
  }, [membershipSettings]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSaving(true);
    const nextBenefits = benefitsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    updateMembershipSettings({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      price: Number(price) || 0,
      benefits: nextBenefits,
    });
    setSaving(false);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-2xl w-full"
      >
        <h2 className="text-lg font-medium">VIP membership</h2>
        <p className="text-sm text-gray-500">
          Control the RayLux VIP membership page content and membership price. This
          information is used on the customer account page and in the membership
          checkout.
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="membership-title">
            Title
          </label>
          <input
            id="membership-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="membership-subtitle">
            Subtitle
          </label>
          <input
            id="membership-subtitle"
            type="text"
            value={subtitle}
            onChange={(event) => setSubtitle(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="membership-description">
            Description
          </label>
          <textarea
            id="membership-description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full resize-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="membership-price">
            Membership price
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">{currency}</span>
            <input
              id="membership-price"
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full"
            />
          </div>
          <p className="text-xs text-gray-500">
            This is the one-time amount charged when a customer joins RayLux VIP.
            Set to 0 to make membership free.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="membership-benefits">
            Benefits (one per line)
          </label>
          <textarea
            id="membership-benefits"
            rows={5}
            value={benefitsText}
            onChange={(event) => setBenefitsText(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 w-full resize-none"
          />
          <p className="text-xs text-gray-500">
            These points are shown as a bullet list on the customer membership
            card.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save membership settings"}
        </button>
      </form>
    </div>
  );
};

export default MembershipSettingsPage;

