import Link from 'next/link'
import React from 'react'

function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center 
   bg-[#F1F3E0] p-4">

      <div className="bg-gradient-to-br from-white via-emerald-50 to-sage-100
      p-6 rounded-xl shadow-xl w-full max-w-sm border border-emerald-200">

        <div className="text-2xl font-semibold text-center mb-4 
        text-emerald-800 tracking-wide">
          FADSS
        </div>

        <div className="flex flex-col gap-4">

          <div className="flex flex-col">
            <input 
              type='text' 
              placeholder='Username' 
              className="border border-emerald-300 p-2 rounded-md
              bg-emerald-50 text-emerald-900
              focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <input 
              type='password' 
              placeholder='Password' 
              className="border border-emerald-300 p-2 rounded-md
              bg-emerald-50 text-emerald-900
              focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm"
            />
          </div>

        </div>

        <div className="mt-5">
          <button 
            type='button' 
            className="w-full bg-emerald-600 text-white py-2 rounded-md 
            shadow-md hover:bg-emerald-700 transition">
            Login
          </button>
        </div>

        <div className="mt-4 text-center">
          <span className="text-sm text-emerald-900">
            Don't have an account? 
            <Link href="/signup" 
              className="text-green-800 font-semibold hover:underline ml-1">
              Signup
            </Link>
          </span>
        </div>

      </div>
    </div>
  )
}

export default Login
