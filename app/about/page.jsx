"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

const AboutPage = () => {
  const { branding } = useAppContext();

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10 flex flex-col gap-12 max-w-6xl mx-auto">
        <section className="grid md:grid-cols-[1.4fr,1fr] gap-10 items-start">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-orange-600 uppercase">
              Our Story
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
              Premium human hair that looks and feels like it grew from your scalp.
            </h1>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              RayLux Hairs was created for women who want flawless installs that stay
              beautiful, wash after wash. Every bundle is carefully sourced,
              triple‑drawn, and quality checked so you get fullness from root to tip,
              minimal shedding, and long‑lasting shine.
            </p>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              From everyday looks to glam occasions, our mission is simple: help you
              step out with confidence, knowing your hair will always match the
              standard you set for yourself.
            </p>
          </div>

          <div className="border border-gray-200 rounded-2xl p-6 bg-gradient-to-b from-orange-50/70 to-white space-y-4">
            <p className="text-sm text-gray-500">Why shoppers choose RayLux Hairs</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">100%+</p>
                <p className="text-gray-600">Human hair only. No synthetic blends.</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">30+ days</p>
                <p className="text-gray-600">Average install life with proper care.</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">Nationwide</p>
                <p className="text-gray-600">Delivery across Nigeria to your doorstep.</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-gray-900">Support</p>
                <p className="text-gray-600">Friendly help before and after purchase.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-base font-semibold mb-2 text-gray-900">Quality first</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              We hand‑select each batch of hair from trusted sources. Textures are
              aligned, cuticles are preserved, and bundles are double or
              triple‑drawn so they stay full from root to tip.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-base font-semibold mb-2 text-gray-900">Install‑ready bundles</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our lengths and textures are curated with stylists in mind, so your
              stylist spends less time fixing bundles and more time creating the
              look you want.
            </p>
          </div>
          <div className="border border-gray-200 rounded-xl p-5 bg-white">
            <h2 className="text-base font-semibold mb-2 text-gray-900">Built for Nigerian weather</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              From Lagos humidity to Abuja heat, we select hair that holds curls,
              presses bone‑straight, and still bounces back after styling.
            </p>
          </div>
        </section>

        <section className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white flex flex-col md:flex-row gap-6 md:items-center">
          <div className="flex-1 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Our promise to you</h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Every RayLux order is treated like it is going on our own head. If
              something is not right, we do our best to fix it quickly. We are here
              to earn your repeat business, not just your first purchase.
            </p>
          </div>
          <div className="flex-1 space-y-2 text-sm text-gray-600">
            <p>
              Need help choosing textures or lengths for your next install? Our team
              is happy to guide you.
            </p>
            <p className="font-medium text-gray-900">
              Call/WhatsApp: {branding.footerPhone || "+234 000 000 0000"}
            </p>
            <p className="font-medium text-gray-900">
              Email: {branding.footerEmail || "support@rayluxhairs.com"}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default AboutPage;
