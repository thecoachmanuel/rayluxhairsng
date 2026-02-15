import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const Footer = () => {
  const { branding } = useAppContext();

  return (
    <div className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-10">
      <div className="flex items-center gap-4">
        <div className="hidden md:block text-xl font-semibold tracking-tight text-gray-900">
          RayLux Hairs
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          {branding.sellerFooterNote}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <a href={branding.facebookUrl || "#"}>
          <Image src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href={branding.twitterUrl || "#"}>
          <Image src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href={branding.instagramUrl || "#"}>
          <Image src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
