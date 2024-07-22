"use client"

import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import React from 'react'


function Header() {
  const {user, isSignedIn } = useUser();
  return (
    <div className='p-5 flex justify-between items-center border shadow-sm'>
      <div className="flex flex-row items-center">
        <span>Money-mateAi</span>
      </div>
      <div className="">
        <button>button 1</button>
        <button>button 2</button>
      </div>
    </div>
  )
}

export default Header
