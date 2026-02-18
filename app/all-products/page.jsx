"use client";
import { Suspense, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

const AllProductsContent = () => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((product) => {
      if (product.category) {
        set.add(product.category);
      }
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query);

      const matchesCategory =
        category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full gap-6">
          <div className="flex flex-col items-start">
            <p className="text-2xl font-medium">All products</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full md:w-64 lg:w-72 outline-none border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Search bundles, wigs, textures..."
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full md:w-40 outline-none border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-10 pb-14 w-full">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
          {filteredProducts.length === 0 && (
            <p className="text-sm text-gray-500 col-span-full text-center mt-8">
              No products match your search. Try a different keyword or
              category.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const AllProducts = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center px-6">
            <p className="text-sm text-gray-600">Loading products...</p>
          </div>
          <Footer />
        </div>
      }
    >
      <AllProductsContent />
    </Suspense>
  );
};

export default AllProducts;
