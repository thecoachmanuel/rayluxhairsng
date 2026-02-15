'use client'
import React from "react";
import { useAppContext } from "@/context/AppContext";

const NewsletterPage = () => {
  const { newsletterEmails } = useAppContext();

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="md:p-10 p-4 space-y-5 max-w-3xl w-full">
        <h2 className="text-lg font-medium">Newsletter signups</h2>
        <p className="text-sm text-gray-500">
          Emails captured from the Join the RayLux Hairs insiders list section
          on the homepage.
        </p>
        {newsletterEmails.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4">
            No subscribers yet. Once shoppers subscribe, their emails will
            appear here.
          </p>
        ) : (
          <div className="mt-4 border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {newsletterEmails.map((email) => (
                  <tr
                    key={email}
                    className="border-t border-gray-100 text-gray-700"
                  >
                    <td className="px-4 py-2">{email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterPage;

