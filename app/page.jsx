"use client";
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
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg w-12 h-12 md:w-14 md:h-14 flex items-center justify-center cursor-pointer"
      >
        <span className="sr-only">Chat on WhatsApp</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-6 h-6 md:w-7 md:h-7 fill-current"
        >
          <path d="M16 3C9.383 3 4 8.383 4 15c0 2.42.73 4.664 1.99 6.544L4 29l7.647-1.953A11.915 11.915 0 0 0 16 27c6.617 0 12-5.383 12-12S22.617 3 16 3Zm0 2c5.527 0 10 4.473 10 10s-4.473 10-10 10a9.9 9.9 0 0 1-4.922-1.336l-.352-.207-4.52 1.155 1.207-4.395-.229-.36A9.9 9.9 0 0 1 6 15C6 9.473 10.473 5 16 5Zm-2.268 4.5c-.227 0-.59.082-.898.41-.309.328-1.18 1.152-1.18 2.81 0 1.657 1.209 3.258 1.377 3.484.168.226 2.336 3.734 5.77 5.085 2.853 1.13 3.436.907 4.055.851.62-.055 1.994-.813 2.275-1.6.28-.787.28-1.46.196-1.6-.083-.141-.309-.227-.646-.398-.338-.172-1.994-.983-2.304-1.096-.31-.113-.535-.17-.76.17-.226.34-.87 1.095-1.067 1.32-.196.226-.392.255-.73.085-.338-.17-1.428-.527-2.72-1.68-1.007-.9-1.686-2.013-1.883-2.353-.196-.34-.02-.523.147-.693.151-.151.338-.392.507-.589.169-.198.226-.34.339-.566.112-.226.056-.425-.028-.596-.085-.17-.76-1.832-1.077-2.513-.283-.61-.575-.637-.803-.637Z" />
        </svg>
      </button>
      <Footer />
    </>
  );
};

export default Home;
