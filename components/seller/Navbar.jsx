import React from 'react'
import { useAppContext } from '@/context/AppContext'

const Navbar = () => {

  const { router } = useAppContext()

  return (
    <div className='flex items-center px-4 md:px-8 py-3 justify-between border-b'>
      <button
        type="button"
        onClick={() => router.push('/')}
        className="cursor-pointer text-xl md:text-2xl font-semibold tracking-tight text-gray-900"
      >
        Raylux Hairs
      </button>
      <button className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar
