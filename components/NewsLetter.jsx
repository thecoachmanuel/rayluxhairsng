import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";

const NewsLetter = () => {
  const { addNewsletterEmail } = useAppContext();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("Please enter an email address.");
      return;
    }
    addNewsletterEmail(trimmed);
    setStatus("Thanks for subscribing to RayLux Hairs updates.");
    setEmail("");
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 pt-8 pb-14">
      <h1 className="md:text-4xl text-2xl font-medium">
        Join the RayLux Hairs insiders list
      </h1>
      <p className="md:text-base text-gray-500/80 pb-4">
        Be the first to know about new textures, restocks, and exclusive bundle
        deals.
      </p>
      <form
        onSubmit={handleSubscribe}
        className="flex items-center justify-between max-w-2xl w-full md:h-14 h-12"
      >
        <input
          className="border border-gray-500/30 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email address"
        />
        <button
          type="submit"
          className="md:px-12 px-8 h-full text-white bg-orange-600 rounded-md rounded-l-none"
        >
          Subscribe
        </button>
      </form>
      {status && (
        <p className="text-xs md:text-sm text-gray-500 mt-2">{status}</p>
      )}
    </div>
  );
};

export default NewsLetter;
