"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabaseClient";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    if (supabase) {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data)) {
        setMessages(data);
        setLoading(false);
        return;
      }
    }
    setMessages([]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm">
      {loading ? (
        <Loading />
      ) : (
        <div className="md:p-10 p-4 space-y-5">
          <h2 className="text-lg font-medium">Contact messages</h2>
          <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                No messages yet. When customers submit the contact form, they will
                appear here.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">From</th>
                    <th className="px-4 py-2 text-left font-medium">Subject</th>
                    <th className="px-4 py-2 text-left font-medium">Message</th>
                    <th className="px-4 py-2 text-left font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((row) => (
                    <tr
                      key={row.id || row._id}
                      className="border-t border-gray-100 align-top"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {row.full_name || "Unnamed"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {row.email}
                          {row.phone && (
                            <span className="ml-1">· {row.phone}</span>
                          )}
                        </p>
                      </td>
                      <td className="px-4 py-3 w-52">
                        <p className="text-gray-800 truncate text-sm">
                          {row.subject || "No subject"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {row.message}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {row.created_at
                          ? new Date(row.created_at).toLocaleString()
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MessagesPage;

