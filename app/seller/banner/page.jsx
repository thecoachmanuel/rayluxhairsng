'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const BannerManager = () => {
  const { bannerContent, updateBannerContent } = useAppContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctaLabel, setCtaLabel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setTitle(bannerContent.title);
    setDescription(bannerContent.description);
    setCtaLabel(bannerContent.ctaLabel);
    setImageUrl(bannerContent.imageUrl || "");
  }, [bannerContent]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    updateBannerContent({
      title,
      description,
      ctaLabel,
      imageUrl,
    });
    setSaving(false);
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageUrl("");
    updateBannerContent({
      title,
      description,
      ctaLabel,
      imageUrl: "",
    });
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form
        onSubmit={handleSubmit}
        className="md:p-10 p-4 space-y-5 max-w-xl w-full"
      >
        <h2 className="text-lg font-medium">Homepage Banner</h2>
        <p className="text-sm text-gray-500">
          Update the banner content displayed above the Join the RayLux Hairs
          insiders list section on the homepage.
        </p>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="banner-title">
            Banner title
          </label>
          <input
            id="banner-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            placeholder="Enter banner title"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-base font-medium"
            htmlFor="banner-description"
          >
            Banner description
          </label>
          <textarea
            id="banner-description"
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Enter banner description"
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-xs">
          <label className="text-base font-medium" htmlFor="banner-cta">
            Button label
          </label>
          <input
            id="banner-cta"
            type="text"
            value={ctaLabel}
            onChange={(event) => setCtaLabel(event.target.value)}
            className="outline-none py-2.5 px-3 rounded border border-gray-500/40"
            placeholder="Shop bundle deals"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-base font-medium" htmlFor="banner-image">
            Banner image
          </label>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <input
              id="banner-image"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="max-w-xs text-sm"
            />
            <input
              type="text"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              className="outline-none py-2.5 px-3 rounded border border-gray-500/40 flex-1"
              placeholder="/raylux-hairs/banner-main.jpg or https://res.cloudinary.com/..."
            />
          </div>
          {imageUrl && (
            <div className="mt-3 flex items-start gap-4">
              <div className="text-xs text-gray-500 mt-1">Preview</div>
              <div className="w-40 h-24 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={imageUrl}
                  alt="Banner preview"
                  width={320}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleClearImage}
                className="text-xs text-red-600 underline ml-2"
              >
                Remove image
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save banner"}
        </button>
      </form>
    </div>
  );
};

export default BannerManager;
