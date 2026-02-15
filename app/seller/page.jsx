"use client";
import React, { useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { supabase } from "@/supabaseClient";
import { useAppContext } from "@/context/AppContext";

const AddProduct = () => {

  const { fetchProductData } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bundles');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSeedDemoProducts = async () => {
    setSeedMessage('');
    if (!supabase) {
      setSeedMessage("Supabase is not configured. Check your environment variables.");
      return;
    }
    setSeeding(true);
    try {
      const payload = productsDummyData.map((product) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        offerPrice: product.offerPrice,
        image: product.image,
        category: product.category,
      }));

      const { error } = await supabase.from("products").insert(payload);
      if (error) {
        setSeedMessage("Unable to sync demo products. Please verify your Supabase schema and keys.");
      } else {
        setSeedMessage("RayLux demo products have been synced to Supabase. Reload the storefront to see live data.");
      }
    } catch (error) {
      setSeedMessage("Unexpected error while syncing demo products.");
    }
    setSeeding(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    if (!supabase) {
      setSubmitMessage("Supabase is not configured. Check your environment variables.");
      return;
    }
    if (!name.trim() || !description.trim()) {
      setSubmitMessage("Name and description are required.");
      return;
    }
    const numericPrice = Number(price) || 0;
    const numericOfferPrice = Number(offerPrice) || 0;
    const images = files.filter(Boolean).length
      ? files.map(() => "/raylux-hairs/raw-straight-bundles-1.jpg")
      : ["/raylux-hairs/raw-straight-bundles-1.jpg"];

    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        offerPrice: numericOfferPrice,
        category,
        image: images,
      };
      const { error } = await supabase.from("products").insert([payload]);
      if (error) {
        setSubmitMessage("Unable to add product. Please verify your Supabase schema and keys.");
      } else {
        setSubmitMessage("Product added to Supabase. Refresh the storefront to see it live.");
        setName('');
        setDescription('');
        setCategory('Bundles');
        setPrice('');
        setOfferPrice('');
        setFiles([]);
        fetchProductData();
      }
    } catch (error) {
      setSubmitMessage("Unexpected error while adding product.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 w-full max-w-2xl">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-base font-medium">RayLux demo catalogue</p>
            <p className="text-xs text-gray-500 max-w-md">
              One-click push of the RayLux starter products into your Supabase products table.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSeedDemoProducts}
            disabled={seeding}
            className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium cursor-pointer disabled:opacity-60"
          >
            {seeding ? "Syncing..." : "Sync demo products"}
          </button>
        </div>
        {seedMessage && (
          <p className="text-xs text-gray-600 mt-1">
            {seedMessage}
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">

            {[...Array(4)].map((_, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input onChange={(e) => {
                  const updatedFiles = [...files];
                  updatedFiles[index] = e.target.files[0];
                  setFiles(updatedFiles);
                }} type="file" id={`image${index}`} hidden />
                <Image
                  key={index}
                  className="max-w-24 cursor-pointer"
                  src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                  alt=""
                  width={100}
                  height={100}
                />
              </label>
            ))}

          </div>
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>
        <div className="flex flex-col gap-1 max-w-md">
          <label
            className="text-base font-medium"
            htmlFor="product-description"
          >
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>
        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              defaultValue={category}
            >
              <option value="Bundles">Bundles</option>
              <option value="Wigs">Wigs</option>
              <option value="Frontals">Frontals</option>
              <option value="Closures">Closures</option>
              <option value="Clip-ins">Clip-ins</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded cursor-pointer disabled:opacity-60"
        >
          {submitting ? "Adding..." : "ADD"}
        </button>
        {submitMessage && (
          <p className="text-xs text-gray-600 mt-1">
            {submitMessage}
          </p>
        )}
      </form>
      {/* <Footer /> */}
    </div>
  );
};

export default AddProduct;
