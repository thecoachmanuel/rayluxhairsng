"use client";
import React, { useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

const WishlistPage = () => {
  const { products, wishlistIds } = useAppContext();

  const wishlistProducts = useMemo(
    () => products.filter((product) => wishlistIds.includes(product._id)),
    [products, wishlistIds]
  );

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-8">
        <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
        {wishlistProducts.length === 0 ? (
          <p className="text-gray-500 text-sm">No items in your wishlist yet.</p>
        ) : (
          <div className="grid gap-6 grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))">
            {wishlistProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default WishlistPage;
