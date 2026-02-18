"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const ProductList = () => {
  const { router, products, updateProduct, deleteProduct } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("Bundles");
  const [editPrice, setEditPrice] = useState("");
  const [editOfferPrice, setEditOfferPrice] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(String(product.price));
    setEditOfferPrice(String(product.offerPrice));
    let images = [];
    if (product && product.image) {
      if (Array.isArray(product.image) && product.image.length > 0) {
        images = product.image.filter((value) => typeof value === "string" && value);
      } else if (typeof product.image === "string") {
        images = [product.image];
      }
    }
    const normalized = [0, 1, 2, 3].map((index) => images[index] || "");
    setEditImages(normalized);
    setEditImageFiles(normalized.map(() => null));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCategory("Bundles");
    setEditPrice("");
    setEditOfferPrice("");
    setEditImages([]);
    setEditImageFiles([]);
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    if (!editingId) return;
    setLoading(true);
    try {
      let images = editImages.slice();
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
      if (
        cloudName &&
        uploadPreset &&
        Array.isArray(editImageFiles) &&
        editImageFiles.some((file) => file)
      ) {
        for (let index = 0; index < editImageFiles.length; index++) {
          const file = editImageFiles[index];
          if (!file) continue;
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
              images[index] = data.secure_url;
            }
          } catch (_error) {}
        }
      }

      const finalImages = images.filter(
        (value) => typeof value === "string" && value
      );

      await updateProduct(editingId, {
        name: editName.trim(),
        category: editCategory,
        price: Number(editPrice) || 0,
        offerPrice: Number(editOfferPrice) || 0,
        image: finalImages,
      });
      handleCancelEdit();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    deleteProduct(productId);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    if (categoryFilter !== "All" && product.category !== categoryFilter) {
      return false;
    }
    if (!normalizedSearch) {
      return true;
    }
    const name = typeof product.name === "string" ? product.name : "";
    const category =
      typeof product.category === "string" ? product.category : "";
    return (
      name.toLowerCase().includes(normalizedSearch) ||
      category.toLowerCase().includes(normalizedSearch)
    );
  });

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? (
        <Loading />
      ) : (
        <div className="w-full md:p-10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-4xl w-full mb-4">
            <h2 className="text-lg font-medium">All Product</h2>
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
                  <option value="All">All</option>
                  <option value="Bundles">Bundles</option>
                  <option value="Wigs">Wigs</option>
                  <option value="Frontals">Frontals</option>
                  <option value="Closures">Closures</option>
                  <option value="Clip-ins">Clip-ins</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center max-w-4xl w-full rounded-md bg-white border border-gray-500/20">
            <div className="w-full overflow-x-auto">
              <table className="table-fixed w-full min-w-[640px]">
                <thead className="text-gray-900 text-sm text-left">
                  <tr>
                    <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">
                      Product
                    </th>
                    <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                      Category
                    </th>
                    <th className="px-4 py-3 font-medium truncate">Price</th>
                    <th className="px-4 py-3 font-medium truncate max-sm:hidden">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-500">
                  {filteredProducts.map((product, index) => {
                    const isEditing = editingId === product._id;
                    let primaryImage = "";
                    if (product && product.image) {
                      if (
                        Array.isArray(product.image) &&
                        product.image.length > 0
                      ) {
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

                    return (
                      <React.Fragment
                        key={product._id || String(index)}
                      >
                        <tr className="border-t border-gray-500/20">
                          <td className="md:px-4 pl-2 md:pl-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="bg-gray-500/10 rounded p-2 flex-shrink-0">
                                <Image
                                  src={primaryImage}
                                  alt={product.name}
                                  className="w-16 h-16 object-cover mix-blend-multiply"
                                  width={1280}
                                  height={720}
                                />
                              </div>
                              <span className="truncate w-full text-gray-800 text-sm">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-sm:hidden">
                            {product.category}
                          </td>
                          <td className="px-4 py-3">
                            ₦{product.offerPrice}
                          </td>
                          <td className="px-4 py-3 max-sm:hidden">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  router.push(`/product/${product._id}`)
                                }
                                className="flex items-center gap-1 px-1.5 md:px-3.5 py-2 bg-orange-600 text-white rounded-md"
                              >
                                <span className="hidden md:block">Visit</span>
                                <Image
                                  className="h-3.5"
                                  src={assets.redirect_icon}
                                  alt="redirect_icon"
                                />
                              </button>
                              <button
                                onClick={() => handleEditClick(product)}
                                className="px-2.5 py-2 border border-gray-300 rounded-md text-xs"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="px-2.5 py-2 border border-red-500 text-red-600 rounded-md text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isEditing && (
                          <tr className="border-t border-gray-200 bg-gray-50">
                            <td colSpan={4} className="px-4 py-4">
                              <form
                                onSubmit={handleSaveEdit}
                                className="max-w-2xl w-full space-y-4 bg-white border border-gray-200 rounded-lg p-4"
                              >
                                <h3 className="text-base font-medium">
                                  Edit product
                                </h3>
                                <div className="flex flex-col gap-1">
                                  <label
                                    className="text-sm font-medium"
                                    htmlFor="edit-name"
                                  >
                                    Name
                                  </label>
                                  <input
                                    id="edit-name"
                                    type="text"
                                    value={editName}
                                    onChange={(event) =>
                                      setEditName(event.target.value)
                                    }
                                    className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                    required
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <label
                                    className="text-sm font-medium"
                                    htmlFor="edit-category"
                                  >
                                    Category
                                  </label>
                                  <select
                                    id="edit-category"
                                    className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                    value={editCategory}
                                    onChange={(event) =>
                                      setEditCategory(event.target.value)
                                    }
                                  >
                                    <option value="Bundles">Bundles</option>
                                    <option value="Wigs">Wigs</option>
                                    <option value="Frontals">Frontals</option>
                                    <option value="Closures">Closures</option>
                                    <option value="Clip-ins">Clip-ins</option>
                                    <option value="Accessories">Accessories</option>
                                  </select>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  <div className="flex flex-col gap-1 min-w-[140px]">
                                    <label
                                      className="text-sm font-medium"
                                      htmlFor="edit-price"
                                    >
                                      Price
                                    </label>
                                    <input
                                      id="edit-price"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={editPrice}
                                      onChange={(event) =>
                                        setEditPrice(event.target.value)
                                      }
                                      className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                      required
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1 min-w-[140px]">
                                    <label
                                      className="text-sm font-medium"
                                      htmlFor="edit-offer-price"
                                    >
                                      Offer price
                                    </label>
                                    <input
                                      id="edit-offer-price"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      value={editOfferPrice}
                                      onChange={(event) =>
                                        setEditOfferPrice(
                                          event.target.value
                                        )
                                      }
                                      className="outline-none py-2 px-3 rounded border border-gray-500/40"
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm font-medium">
                                    Product images
                                  </p>
                                  <div className="flex flex-wrap items-center gap-3 mt-1">
                                    {[0, 1, 2, 3].map((index) => {
                                      const file = editImageFiles[index];
                                      const previewSrc = file
                                        ? URL.createObjectURL(file)
                                        : editImages[index];
                                      return (
                                        <label
                                          key={index}
                                          htmlFor={`edit-image-${index}`}
                                          className="cursor-pointer"
                                        >
                                          <input
                                            id={`edit-image-${index}`}
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(event) => {
                                              const selectedFile =
                                                event.target.files &&
                                                event.target.files[0];
                                              const nextFiles = [
                                                ...editImageFiles,
                                              ];
                                              nextFiles[index] =
                                                selectedFile || null;
                                              setEditImageFiles(nextFiles);
                                            }}
                                          />
                                          <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                                            {previewSrc ? (
                                              <Image
                                                src={previewSrc}
                                                alt="product image"
                                                className="w-full h-full object-cover"
                                                width={80}
                                                height={80}
                                              />
                                            ) : (
                                              <Image
                                                src={assets.upload_area}
                                                alt="upload placeholder"
                                                className="w-10 h-10 opacity-60"
                                                width={40}
                                              />
                                            )}
                                          </div>
                                        </label>
                                      );
                                    })}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    type="submit"
                                    className="px-6 py-2 bg-orange-600 text-white rounded-md text-sm"
                                  >
                                    Save changes
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-sm"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-xs text-gray-500"
                      >
                        No products match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
