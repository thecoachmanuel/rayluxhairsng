import React from "react";
import { useAppContext } from "@/context/AppContext";

const Footer = () => {
  const { branding, router } = useAppContext();

  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <div className="w-28 md:w-32 text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
            RayLux Hairs
          </div>
          <p className="mt-6 text-sm">
            {branding.footerDescription}
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="hover:underline transition cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/about")}
                  className="hover:underline transition cursor-pointer text-left"
                >
                  About RayLux Hairs
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/contact")}
                  className="hover:underline transition cursor-pointer text-left"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => router.push("/membership")}
                  className="hover:underline transition cursor-pointer text-left"
                >
                  RayLux membership
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>{branding.footerPhone}</p>
              <p>{branding.footerEmail}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © RayLux Hairs. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
