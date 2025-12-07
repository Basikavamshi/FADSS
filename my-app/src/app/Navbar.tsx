'use client'
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from 'lucide-react';
import Cookies from "universal-cookie";
function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [auth,setauth]=useState(false);
  const [Profile,SetProfile]=useState(false)
  const [userdetails,setuserdetails]=useState({
    "username":"",
    "email":"",
    "phone":null,
    "address":""
  })
  const router = useRouter();
  const cookies=new Cookies();
  useEffect(()=>{
      setauth(cookies.get('auth'))
      setuserdetails(
        {
          "username":cookies.get("firstname"),
          "email":cookies.get("email"),
          "phone":cookies.get("phone"),
          "address":cookies.get("address")
        }
      )
  },[])
  const {username,email,phone,address}=userdetails
  const navigateToLogin = (item) => {
    router.push(`/${item}`);
  };
  const profilepage=()=>{
      if(Profile){
         SetProfile(false)
      }
      else{
        SetProfile(true)
      }
  }
  return (
    <nav className="bg-white shadow-md border-b-2 border-green-100 px-4 sm:px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <div className="flex-shrink-0">
          <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            FADSS
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {["Chatbot", "Wheather", "LiveChat"].map((item, i) => (
            <div 
              key={i} 
              className="group cursor-pointer"
              onClick={()=>navigateToLogin(item.toString())}
            >
              <span className="text-gray-700 font-medium hover:text-green-600 transition-colors duration-200">
                {item}
              </span>
              <div className="h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}

          {auth?
            <div className="grid grid-cols-1 grid-rows-1 relative w-full h-full justify-center align-middle" >
              <span className="bg-green-600 text-white px-1 py-1 rounded-4xl font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-300 cursor-pointer inline-block" onClick={profilepage}><UserRound/></span>
              <div className={`${Profile?"grid":"hidden"} absolute top-[150%] right-1/5 grid-cols-1 grid-flow-row rounded-sm w-50 h-60 overflow-hidden bg-white p-3 shadow-2xl shadow-emerald-200`}>
                <div className={`grid grid-cols-1 grid-rows-2 border-2 h-full w-full p-2 justify-items-start`}>
                   <span className="text-black text-[1em] ">{username} farmer</span>
                   <span className="text-black text-[0.8em]">{email}</span>
                </div>
                <div className="grid grid-cols-1 grid-flow-row justify-start justify-items-start">
                  <span className="text-black">Phone : {phone}</span>
                  <span className="text-black">Location :{address}</span>
                  <button className="text-black">Edit Profile</button>
                  <button className="text-red-500">Logout</button>
                </div>
               
                
              </div>
            </div>
            :<span 
            onClick={()=>navigateToLogin('login')}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-300 cursor-pointer inline-block"
          >
            Login
          </span>
         
          }
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 p-2 hover:bg-green-50 rounded-lg transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 pb-4 px-2 sm:px-4 animate-slide-down">
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4 border border-green-100">

            {["Chatbot", "Wheather", "LiveChat"].map((item, i) => (
              <div 
                key={i} 
                className="group cursor-pointer"
                onClick={()=>navigateToLogin(item)}
              >
                <span className="text-gray-700 text-lg font-medium hover:text-green-600 transition-colors duration-200">
                  {item}
                </span>
                <div className="h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
            
            <span 
              onClick={navigateToLogin}
              className="bg-green-600 text-white text-center w-full block px-6 py-3 rounded-lg font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              Login
            </span>

          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;