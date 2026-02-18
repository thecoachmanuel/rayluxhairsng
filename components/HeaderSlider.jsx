import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
  const { heroSlides } = useAppContext();
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!heroSlides.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handlePrimaryClick = (slide) => {
    if (slide.primaryProductId) {
      router.push(`/product/${slide.primaryProductId}`);
      return;
    }
    router.push("/all-products");
  };

  const handleSecondaryClick = (slide) => {
    if (slide.secondaryProductId) {
      router.push(`/product/${slide.secondaryProductId}`);
      return;
    }
    router.push("/all-products");
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {heroSlides.map((slide, index) => {
          const imageSrc =
            slide.imageUrl ||
            "/raylux-hairs/body-wave-lace-wig-1.jpg";
          return (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button
                  className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium"
                  onClick={() => handlePrimaryClick(slide)}
                >
                  {slide.buttonText1}
                </button>
                <button
                  className="group flex items-center gap-2 px-6 py-2.5 font-medium"
                  onClick={() => handleSecondaryClick(slide)}
                >
                  {slide.buttonText2}
                  <Image
                    className="group-hover:translate-x-1 transition"
                    src={assets.arrow_icon}
                    alt="arrow_icon"
                  />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={imageSrc}
                alt={`Slide ${index + 1}`}
                width={400}
                height={400}
              />
            </div>
          </div>
        )})}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {heroSlides.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
