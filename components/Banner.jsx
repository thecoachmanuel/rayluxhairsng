import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Banner = () => {
  const { bannerContent } = useAppContext();
  const mainImageSrc = bannerContent.imageUrl || null;

  return (
    <div className="flex flex-col items-center justify-center px-6 md:px-20 py-20 md:py-24 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 my-16 rounded-xl overflow-hidden">
      {mainImageSrc && (
        <Image
          className="max-w-56"
          src={mainImageSrc}
          alt="raylux_hairs_model_left"
        />
      )}
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          {bannerContent.title}
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          {bannerContent.description}
        </p>
        <button className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white">
          {bannerContent.ctaLabel}
          <Image
            className="group-hover:translate-x-1 transition"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
          />
        </button>
      </div>
    </div>
  );
};

export default Banner;
