
import Link from "next/link"
import { Menu } from 'lucide-react';
function Navbar() {
  return (
    <div className="grid border-2 grid-cols-[1fr] grid-rows-[1fr] w-1/1 h-1/1 box-border p-3.5 justify-center items-center align-middle">
        <div className="grid grid-flow-col grid-rows-[1fr] gap-2 h-1/1 w-1/1">
           <div className="grid ">
              <span>FADSS</span>
           </div>
          <div className="grid grid-flow-col grid-rows-[1fr] justify-evenly justify-items-center-safe align-middle self-center justify-self-end h-1/1 w-1/1">
            <div><span>chatbot</span></div>
            <div><span>wheather</span></div>
            <div><span>livechat</span></div>
            <div><span><Menu/></span></div>
            <div><Link href={'/login'}><span>Login</span></Link></div>
           </div>
        </div>
    </div>
  )
}

export default Navbar