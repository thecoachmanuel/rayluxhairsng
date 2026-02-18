'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex flex-1 w-full">
        <Sidebar />
        <div className="flex-1 min-h-screen overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
