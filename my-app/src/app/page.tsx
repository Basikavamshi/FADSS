'use client'
import Image from "next/image";
import Navbar from "./Navbar";
import Welcome from "./welcome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "universal-cookie";
export default function Home() {
  const cookie=new Cookies();
  const router=useRouter();
  /* useEffect(()=>{
    if(cookie.get('auth')){
      router.push('/DashBoard')
    }
  }) */
  return (
    <div className="flex min-h-screen items-top flex-col  h-1/1 w-1/1">
      <div>
        <Navbar/>
      </div>
      <div className="grid grid-cols-1 grid-rows-1 h-1/1 w-1/1">
        <Welcome/>
      </div>
    </div>
  );
}

