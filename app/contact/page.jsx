"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { supabase } from "@/supabaseClient";

const ContactPage = () => {
  const { branding } = useAppContext();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setError("Name, email, and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      if (supabase) {
        const payload = {
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          subject: subject.trim() || null,
          message: message.trim(),
        };
        const { error: insertError } = await supabase
          .from("contact_messages")
          .insert([payload]);
        if (insertError) {
          setError("Unable to send message. Please try again.");
        } else {
          setSuccess("Message sent. We will get back to you shortly.");
          setFullName("");
          setEmail("");
          setPhone("");
          setSubject("");
          setMessage("");
        }
      } else {
        setError("Contact form is not available right now.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 pt-20 md:pt-24 pb-10 max-w-6xl mx-auto flex flex-col gap-10">
        <section className="max-w-2xl space-y-3">
          <p className="text-xs font-semibold tracking-[0.2em] text-orange-600 uppercase">
            Contact
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            Have questions about bundles, textures, or your order?
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            Send us a message and a RayLux team member will reach out. Share as
            much detail as you can so we can support you quickly.
          </p>
        </section>

        <section className="grid md:grid-cols-[1.4fr,1fr] gap-10 items-start">
          <form onSubmit={handleSubmit} className="space-y-4 border border-gray-200 rounded-2xl p-6 bg-white">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="WhatsApp or mobile number"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Order help, product advice..."
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-md text-sm font-medium cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-2xl p-6 bg-white">
              <h2 className="text-base font-semibold text-gray-900 mb-2">
                Talk to the RayLux team
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Reach out through the form or use any of the channels below. We
                respond to most messages within one business day.
              </p>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Phone/WhatsApp: </span>
                  {branding.footerPhone || "+234 000 000 0000"}
                </p>
                <p>
                  <span className="font-medium">Email: </span>
                  {branding.footerEmail || "support@rayluxhairs.com"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
