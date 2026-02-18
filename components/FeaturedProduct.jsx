import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const FeaturedProduct = () => {
  const { products, featuredProductIds, router } = useAppContext();

  const featuredProducts = featuredProductIds
    .map((id) => products.find((product) => product._id === id))
    .filter(Boolean)
    .slice(0, 3);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">Featured RayLux Hairs</p>
        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
        {featuredProducts.map((product) => {
          let primaryImage = "";
          if (product && product.image) {
            if (Array.isArray(product.image) && product.image.length > 0) {
              primaryImage = product.image.find((value) => typeof value === "string" && value) || "";
            } else if (typeof product.image === "string") {
              primaryImage = product.image;
            }
          }
          if (!primaryImage) {
            primaryImage = "/raylux-hairs/raw-straight-bundles-1.jpg";
          }

          return (
            <div key={product._id} className="relative group">
              <Image
                src={primaryImage}
                alt={product.name}
                className="group-hover:brightness-75 transition duration-300 w-full h-64 object-cover"
                width={800}
                height={800}
              />
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{product.name}</p>
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  {product.description}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/product/${product._id}`);
                    if (typeof window !== "undefined" && window.scrollTo) {
                      window.scrollTo(0, 0);
                    }
                  }}
                  className="flex items-center gap-1.5 bg-orange-600 px-4 py-2 rounded"
                >
                  Buy now
                  <Image
                    className="h-3 w-3"
                    src={assets.redirect_icon}
                    alt="Redirect Icon"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturedProduct;
