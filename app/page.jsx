'use client'
import React from "react";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const whatsappPhone = "2348141181909";

const Home = () => {
  const handleWhatsAppClick = () => {
    const message = "Hi RayLux Hairs, I would like to shop your bundles and wigs.";
    const url = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        <HomeProducts />
        <FeaturedProduct />
        <Banner />
        <NewsLetter />
      </div>
      <button
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg px-4 py-3 flex items-center gap-2 cursor-pointer"
      >
        <span className="text-sm font-medium">Chat on WhatsApp</span>
      </button>
      <Footer />
    </>
  );
};

export default Home;
