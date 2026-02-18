"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import { assets } from "@/assets/assets";

const FeaturedManager = () => {
  const { products, featuredProductIds, updateFeaturedProducts } =
    useAppContext();

  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    setSelectedIds(featuredProductIds);
  }, [featuredProductIds]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product && product.category && typeof product.category === "string") {
        set.add(product.category);
      }
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const toggleProduct = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      return;
    }
    if (selectedIds.length >= 3) {
      return;
    }
    setSelectedIds([...selectedIds, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    updateFeaturedProducts(selectedIds);
    setSaving(false);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const category =
      typeof product.category === "string" ? product.category : "";
    if (categoryFilter !== "All" && category !== categoryFilter) {
      return false;
    }
    if (!normalizedSearch) {
      return true;
    }
    const name = typeof product.name === "string" ? product.name : "";
    const description =
      typeof product.description === "string" ? product.description : "";
    return (
      name.toLowerCase().includes(normalizedSearch) ||
      category.toLowerCase().includes(normalizedSearch) ||
      description.toLowerCase().includes(normalizedSearch)
    );
  });

  if (products.length === 0) {
    return (
      <div className="flex-1 min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-5 max-w-4xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">Featured Section</h2>
            <p className="text-sm text-gray-500 max-w-md">
              Tap products to feature them on the homepage. You can feature up to
              three products at a time.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative max-w-xs w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Image
                  src={assets.search_icon}
                  alt="search_icon"
                  className="w-3.5 h-3.5"
                />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs bg-white outline-none"
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center text-sm text-gray-500 py-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
              No products match the selected filters.
            </div>
          )}
          {filteredProducts.map((product) => {
            const isSelected = selectedIds.includes(product._id);

            let primaryImage = "";
            if (product && product.image) {
              if (Array.isArray(product.image) && product.image.length > 0) {
                primaryImage =
                  product.image.find(
                    (value) => typeof value === "string" && value
                  ) || "";
              } else if (typeof product.image === "string") {
                primaryImage = product.image;
              }
            }
            if (!primaryImage) {
              primaryImage = "/raylux-hairs/raw-straight-bundles-1.jpg";
            }

            const price =
              Number(product.offerPrice) || Number(product.price) || 0;

            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggleProduct(product._id)}
                className={`text-left border rounded-lg p-3 flex flex-col gap-3 transition-all ${
                  isSelected
                    ? "border-orange-600 bg-orange-50 shadow-sm"
                    : "border-gray-300 bg-white hover:border-orange-400 hover:shadow-sm"
                }`}
              >
                <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-800">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {product.description}
                  </p>
                  <p className="text-xs text-gray-600">
                    {product.category} • ₦{price}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
                      isSelected
                        ? "bg-orange-600 border-orange-600 text-white"
                        : "bg-white border-orange-500 text-orange-600"
                    }`}
                  >
                    {isSelected ? "Selected for featured" : "Tap to feature"}
                  </span>
                  {selectedIds.includes(product._id) && (
                    <span className="text-[10px] text-orange-700 font-medium">
                      Featured
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-2.5 bg-orange-600 text-white font-medium rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save featured products"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedManager;
