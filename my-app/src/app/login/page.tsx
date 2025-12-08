'use client'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Cookies from 'universal-cookie'
import path from 'path'
function Login() {
  const [userdata,setuserdata]=useState({
    "identifier":"",
    "password":"",})
  const cookie=new Cookies();
  const router=useRouter();
  const inputHandler=(e)=>{
       setuserdata({...userdata,[e.target.name]:e.target.value})
  }
  const {identifier,password}=userdata;
 
  const HandleForm=()=>{
    axios.post("http://127.0.0.1:8000/login/",userdata,{headers:{
      "Content-Type":"application/json"
    }}).then((res)=>{
      console.log(res.data['refresh'])
      cookie.set('auth',res.data['auth'],{path:'/'})
      cookie.set('refresh',res.data['refresh'],{path:'/'})
      cookie.set('access',res.data['access'],{path:'/'})
      cookie.set('firstname',res.data['user'].first_name,{path:'/'})
      cookie.set('lastname',res.data['user'].last_name,{path:'/'})
      cookie.set('email',res.data['user'].email,{path:'/'})
      cookie.set('phone',res.data['user'].phone,{path:'/'})
      cookie.set('address',res.data['user'].address,{path:'/'})
 HEAD

      router.push('/DashBoard');

    }).catch((e)=>{

      return res.data['auth']
    }).then((auth)=>
      auth?router.push('/'):console.log("not authenticated")
  ).catch((e)=>{

      console.log(e)
    })

  }
  useEffect(()=>{
    if(cookie.get('auth')){
      router.push('/')
    }
  },[])


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
              name='identifier'
              value={identifier}
              onChange={inputHandler}
              className="border border-emerald-300 p-2 rounded-md
              bg-emerald-50 text-emerald-900
              focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <input 
              type='password' 
              placeholder='Password' 
              name='password'
              value={password}
              onChange={inputHandler}
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
            shadow-md hover:bg-emerald-700 transition" onClick={HandleForm}>
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