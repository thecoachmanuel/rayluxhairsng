'use client'
import Navbar from '@/components/seller/Navbar'
import Sidebar from '@/components/seller/Sidebar'
import React from 'react'

const Layout = ({ children }) => {
	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex-1 flex flex-col md:flex-row w-full">
				<Sidebar />
				<main className="flex-1 w-full overflow-x-auto">
					{children}
				</main>
			</div>
		</div>
	)
}

export default Layout
