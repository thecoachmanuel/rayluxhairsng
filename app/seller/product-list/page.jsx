'use client'
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

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setEditName(product.name);
    setEditCategory(product.category);
    setEditPrice(String(product.price));
    setEditOfferPrice(String(product.offerPrice));
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCategory("Bundles");
    setEditPrice("");
    setEditOfferPrice("");
  };

  const handleSaveEdit = (event) => {
    event.preventDefault();
    if (!editingId) return;
    updateProduct(editingId, {
      name: editName,
      category: editCategory,
      price: Number(editPrice),
      offerPrice: Number(editOfferPrice),
    });
    handleCancelEdit();
  };

  const handleDelete = (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;
    deleteProduct(productId);
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className=" table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">
                  Price
                </th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.image[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="truncate w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
									<td className="px-4 py-3">₦{product.offerPrice}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/product/${product._id}`)}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      {editingId && (
        <div className="w-full md:p-10 p-4 border-t border-gray-200 bg-gray-50">
          <form
            onSubmit={handleSaveEdit}
            className="max-w-xl w-full space-y-4 bg-white border border-gray-200 rounded-lg p-4"
          >
            <h3 className="text-base font-medium">Edit product</h3>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="edit-name">
                Name
              </label>
              <input
                id="edit-name"
                type="text"
                value={editName}
                onChange={(event) => setEditName(event.target.value)}
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium" htmlFor="edit-category">
                Category
              </label>
              <select
                id="edit-category"
                className="outline-none py-2 px-3 rounded border border-gray-500/40"
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value)}
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
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium" htmlFor="edit-price">
                  Price
                </label>
                <input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editPrice}
                  onChange={(event) => setEditPrice(event.target.value)}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40"
                  required
                />
              </div>
              <div className="flex flex-col gap-1">
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
                  onChange={(event) => setEditOfferPrice(event.target.value)}
                  className="outline-none py-2 px-3 rounded border border-gray-500/40"
                  required
                />
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
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductList;
