"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HeroSliderManager = () => {
  const { heroSlides, updateHeroSlides } = useAppContext();

  const [title, setTitle] = useState("");
  const [offer, setOffer] = useState("");
  const [buttonText1, setButtonText1] = useState("");
  const [buttonText2, setButtonText2] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [uploadingNew, setUploadingNew] = useState(false);
  const [uploadingSlideId, setUploadingSlideId] = useState(null);

  const uploadImageFile = async (file) => {
    if (!file) return null;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset) {
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
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
        return data.secure_url;
      }
    } catch (_error) {}
    return null;
  };

  const handleAddSlide = async (event) => {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setUploadingNew(true);

    let finalImageUrl = imageUrl.trim();
    if (imageFile) {
      const uploadedUrl = await uploadImageFile(imageFile);
      if (uploadedUrl) {
        finalImageUrl = uploadedUrl;
      }
    }

    const newSlide = {
      id: `slide_${Date.now()}`,
      title: trimmedTitle,
      offer: offer.trim(),
      buttonText1: buttonText1.trim() || "Shop now",
      buttonText2: buttonText2.trim() || "Learn more",
      imageUrl: finalImageUrl,
    };
    updateHeroSlides([...heroSlides, newSlide]);
    setUploadingNew(false);
    setTitle("");
    setOffer("");
    setButtonText1("");
    setButtonText2("");
    setImageUrl("");
    setImageFile(null);
  };

  const handleDeleteSlide = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this slide?"
    );
    if (!confirmDelete) return;
    const remaining = heroSlides.filter((slide) => slide.id !== id);
    updateHeroSlides(remaining);
  };

  const handleUpdateField = (id, field, value) => {
    const updated = heroSlides.map((slide) =>
      slide.id === id ? { ...slide, [field]: value } : slide
    );
    updateHeroSlides(updated);
  };

  const handleExistingSlideFileChange = async (id, file) => {
    if (!file) return;
    setUploadingSlideId(id);
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      handleUpdateField(id, "imageUrl", uploadedUrl);
    }
    setUploadingSlideId(null);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-6 max-w-4xl w-full">
        <h2 className="text-lg font-medium">Hero Slider</h2>
        <p className="text-sm text-gray-500">
          Manage the slides shown in the homepage hero section. Use wig and hair
          visuals for a strong RayLux Hairs presence.
        </p>

        <div className="space-y-4">
          <h3 className="text-base font-medium">Existing slides</h3>
          {heroSlides.length === 0 && (
            <p className="text-sm text-gray-500">
              No slides found. Add a new slide below.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4">
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4"
              >
                <div className="w-full md:w-52 h-32 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  <Image
                    src={
                      slide.imageUrl ||
                      "/raylux-hairs/body-wave-lace-wig-1.jpg"
                    }
                    alt={slide.title}
                    width={320}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(event) =>
                        handleUpdateField(slide.id, "title", event.target.value)
                      }
                      className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium">Offer</label>
                    <input
                      type="text"
                      value={slide.offer}
                      onChange={(event) =>
                        handleUpdateField(slide.id, "offer", event.target.value)
                      }
                      className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                      <label className="text-xs font-medium">
                        Primary button
                      </label>
                      <input
                        type="text"
                        value={slide.buttonText1}
                        onChange={(event) =>
                          handleUpdateField(
                            slide.id,
                            "buttonText1",
                            event.target.value
                          )
                        }
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-[140px] flex flex-col gap-1">
                      <label className="text-xs font-medium">
                        Secondary button
                      </label>
                      <input
                        type="text"
                        value={slide.buttonText2}
                        onChange={(event) =>
                          handleUpdateField(
                            slide.id,
                            "buttonText2",
                            event.target.value
                          )
                        }
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium">
                        Image URL or path
                      </label>
                      <input
                        type="text"
                        value={slide.imageUrl}
                        onChange={(event) =>
                          handleUpdateField(
                            slide.id,
                            "imageUrl",
                            event.target.value
                          )
                        }
                        className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                        placeholder="/raylux-hairs/body-wave-lace-wig-1.jpg"
                      />
                    </div>
                    <div className="flex items-center gap-3 text-[11px]">
                      <label
                        htmlFor={`slide-image-${slide.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded border border-gray-300 bg-gray-50 cursor-pointer hover:border-orange-500 hover:text-orange-600"
                      >
                        Upload image from device
                      </label>
                      <input
                        id={`slide-image-${slide.id}`}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(event) => {
                          const file =
                            event.target.files && event.target.files[0];
                          if (file) {
                            handleExistingSlideFileChange(slide.id, file);
                          }
                        }}
                      />
                      {uploadingSlideId === slide.id && (
                        <span className="text-gray-500">Uploading...</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id)}
                    className="mt-2 text-xs text-red-600 underline"
                  >
                    Delete slide
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleAddSlide}
          className="mt-6 border border-gray-200 rounded-lg p-4 space-y-4"
        >
          <h3 className="text-base font-medium">Add new slide</h3>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Title</label>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
              placeholder="Luxury wigs for every occasion"
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium">Offer</label>
            <input
              type="text"
              value={offer}
              onChange={(event) => setOffer(event.target.value)}
              className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
              placeholder="Limited stock on best‑selling units"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-xs font-medium">Primary button</label>
              <input
                type="text"
                value={buttonText1}
                onChange={(event) => setButtonText1(event.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                placeholder="Shop wigs"
              />
            </div>
            <div className="flex-1 min-w-[140px] flex flex-col gap-1">
              <label className="text-xs font-medium">Secondary button</label>
              <input
                type="text"
                value={buttonText2}
                onChange={(event) => setButtonText2(event.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                placeholder="View closures"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium">Image URL or path</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40 text-sm"
                placeholder="/raylux-hairs/body-wave-lace-wig-2.jpg"
              />
            </div>
            <div className="flex items-center gap-3 text-xs">
              <label
                htmlFor="new-slide-image"
                className="inline-flex items-center px-3 py-1.5 rounded border border-gray-300 bg-gray-50 cursor-pointer hover:border-orange-500 hover:text-orange-600"
              >
                Upload image from device
              </label>
              <input
                id="new-slide-image"
                type="file"
                accept="image/*"
                hidden
                onChange={(event) => {
                  const file = event.target.files && event.target.files[0];
                  setImageFile(file || null);
                }}
              />
              {imageFile && (
                <span className="text-gray-500 text-[11px]">
                  {imageFile.name}
                </span>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={uploadingNew}
            className="mt-2 px-6 py-2 bg-orange-600 text-white rounded-md text-sm disabled:opacity-60"
          >
            {uploadingNew ? "Adding..." : "Add slide"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HeroSliderManager;
