'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const BrandingManager = () => {
  const { branding, updateBranding, membershipSettings, updateMembershipSettings } = useAppContext();

  const [logoUrl, setLogoUrl] = useState("");
  const [footerDescription, setFooterDescription] = useState("");
  const [footerPhone, setFooterPhone] = useState("");
  const [footerEmail, setFooterEmail] = useState("");
  const [sellerFooterNote, setSellerFooterNote] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [membershipPrice, setMembershipPrice] = useState("");
  const [membershipBenefits, setMembershipBenefits] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    setLogoUrl(branding.logoUrl || "");
    setFooterDescription(branding.footerDescription);
    setFooterPhone(branding.footerPhone);
    setFooterEmail(branding.footerEmail);
    setSellerFooterNote(branding.sellerFooterNote);
    setFacebookUrl(branding.facebookUrl);
    setTwitterUrl(branding.twitterUrl);
    setInstagramUrl(branding.instagramUrl);
    setMembershipPrice(
      membershipSettings.price && typeof membershipSettings.price === "number"
        ? String(membershipSettings.price)
        : ""
    );
    setMembershipBenefits(membershipSettings.benefits || "");
  }, [branding, membershipSettings]);

  const handleLogoFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    setUploadingLogo(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok && data.secure_url) {
        setLogoUrl(data.secure_url);
      }
    } catch (_error) {
    }
    setUploadingLogo(false);
  };

  const handleClearLogo = () => {
    setLogoUrl("");
    updateBranding({ logoUrl: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    updateBranding({
      logoUrl,
      footerDescription,
      footerPhone,
      footerEmail,
      sellerFooterNote,
      facebookUrl,
      twitterUrl,
      instagramUrl,
    });
    updateMembershipSettings({
      price: Number(membershipPrice) || 0,
      benefits: membershipBenefits,
    });
    setSaving(false);
  };

  const previewLogoSrc = logoUrl || assets.logo;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-3xl w-full"
      >
        <h2 className="text-lg font-medium">Branding & footer</h2>
        <p className="text-sm text-gray-500">
          Update the RayLux Hairs logo and footer details shown across the
          store and seller portal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 items-start">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-800">Logo preview</p>
            <div className="w-40 h-16 rounded-md border border-gray-200 bg-white flex items-center justify-center">
              <Image
                src={previewLogoSrc}
                alt="Logo preview"
                width={160}
                height={64}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium" htmlFor="logo-file">
              Logo image
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <input
                id="logo-file"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="max-w-xs text-sm"
              />
              <input
                type="text"
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40 flex-1"
                placeholder="Optional: paste logo URL or data"
              />
              {uploadingLogo && (
                <span className="text-xs text-gray-500">Uploading...</span>
              )}
            </div>
            {logoUrl && (
              <button
                type="button"
                onClick={handleClearLogo}
                className="text-xs text-red-600 underline"
              >
                Use default logo
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="footer-description">
            Footer description
          </label>
          <textarea
            id="footer-description"
            rows={3}
            value={footerDescription}
            onChange={(event) => setFooterDescription(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 resize-none"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-sm font-medium" htmlFor="footer-phone">
              Footer phone
            </label>
            <input
              id="footer-phone"
              type="text"
              value={footerPhone}
              onChange={(event) => setFooterPhone(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            />
          </div>
          <div className="flex flex-col gap-1 min-w-[220px]">
            <label className="text-sm font-medium" htmlFor="footer-email">
              Footer email
            </label>
            <input
              id="footer-email"
              type="email"
              value={footerEmail}
              onChange={(event) => setFooterEmail(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">
            Membership settings
          </h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-sm font-medium" htmlFor="membership-price">
                Membership price (NGN)
              </label>
              <input
                id="membership-price"
                type="number"
                value={membershipPrice}
                onChange={(event) => setMembershipPrice(event.target.value)}
                className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
                placeholder="e.g. 10000"
                min={0}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="membership-benefits">
              Membership page description
            </label>
            <textarea
              id="membership-benefits"
              rows={4}
              value={membershipBenefits}
              onChange={(event) => setMembershipBenefits(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium" htmlFor="seller-footer-note">
            Seller footer note
          </label>
          <input
            id="seller-footer-note"
            type="text"
            value={sellerFooterNote}
            onChange={(event) => setSellerFooterNote(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="facebook-url">
              Facebook URL
            </label>
            <input
              id="facebook-url"
              type="text"
              value={facebookUrl}
              onChange={(event) => setFacebookUrl(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="twitter-url">
              Twitter URL
            </label>
            <input
              id="twitter-url"
              type="text"
              value={twitterUrl}
              onChange={(event) => setTwitterUrl(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium" htmlFor="instagram-url">
              Instagram URL
            </label>
            <input
              id="instagram-url"
              type="text"
              value={instagramUrl}
              onChange={(event) => setInstagramUrl(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-2 px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save branding"}
        </button>
      </form>
    </div>
  );
};

export default BrandingManager;
