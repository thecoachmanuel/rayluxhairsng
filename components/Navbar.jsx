"use client"
import React, { useEffect, useRef, useState } from "react";
import { assets} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {
  const { isSeller, router, branding, authUser } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    router.push(`/all-products?search=${encodeURIComponent(query)}`);
    setIsSearchOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="cursor-pointer text-xl md:text-2xl font-semibold tracking-tight text-gray-900"
      >
        Raylux Hairs
      </button>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full cursor-pointer"
          >
            Admin Dashboard
          </button>
        )}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        <form
          onSubmit={handleSearchSubmit}
          className={`flex items-center border border-gray-300 rounded-full bg-white overflow-hidden transition-all duration-200 ease-out focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200 ${
            isSearchOpen ? "w-48 lg:w-64 px-3 py-1" : "w-8 h-8 justify-center"
          }`}
        >
          <button
            type="button"
            aria-label="Toggle product search"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            className="flex items-center justify-center cursor-pointer"
          >
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search wigs, bundles..."
            className={`ml-2 flex-1 text-sm outline-none bg-transparent ${
              isSearchOpen ? "block" : "hidden"
            }`}
          />
        </form>
        <button
          onClick={() => router.push("/account")}
          className="flex items-center gap-2 hover:text-gray-900 transition cursor-pointer"
        >
          <Image src={assets.user_icon} alt="user icon" />
          {authUser ? "Account" : "Sign in"}
        </button>
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button
            onClick={() => router.push('/seller')}
            className="text-xs border px-4 py-1.5 rounded-full cursor-pointer"
          >
            Admin Dashboard
          </button>
        )}
        <button
          onClick={() => router.push("/account")}
          className="flex items-center gap-2 hover:text-gray-900 transition cursor-pointer"
        >
          <Image src={assets.user_icon} alt="user icon" />
          {authUser ? "Account" : "Sign in"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
