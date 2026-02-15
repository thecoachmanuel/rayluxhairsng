'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";

const FeaturedManager = () => {
  const { products, featuredProductIds, updateFeaturedProducts } =
    useAppContext();

  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedIds(featuredProductIds);
  }, [featuredProductIds]);

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
        <h2 className="text-lg font-medium">Featured Section</h2>
        <p className="text-sm text-gray-500">
          Select up to three products to highlight in the homepage Featured
          RayLux Hairs section.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product._id);
            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggleProduct(product._id)}
                className={`text-left border rounded-lg p-3 flex flex-col gap-3 ${
                  isSelected
                    ? "border-orange-600 bg-orange-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                <div className="w-full h-32 rounded-md overflow-hidden bg-gray-100">
                  <Image
                    src={product.image[0]}
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
                    {product.category} • ${product.offerPrice}
                  </p>
                </div>
                <div
                  className={`mt-1 text-xs font-medium ${
                    isSelected ? "text-orange-700" : "text-gray-500"
                  }`}
                >
                  {isSelected ? "Selected for featured" : "Tap to feature"}
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

