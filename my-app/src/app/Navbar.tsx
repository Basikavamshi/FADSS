
import Link from "next/link"

function Navbar() {
  return (
    <div className="grid border-2 grid-cols-[1fr] grid-rows-[1fr] w-1/1 h-1/1 box-border p-3.5">
        <div className="grid grid-flow-col grid-rows-[1fr] gap-2 h-1/1 w-1/1">
           <div>
              <span>Logo</span>
           </div>
           <div className="sm:text-amber-300 sm:text sm2:text-red-400"><span>chatbot</span></div>
           <div><span>wheather</span></div>
           <div><span>livechat</span></div>
           <div><span>menu</span></div>
           <div><Link href={'/login'}><span>Login</span></Link></div>
        </div>
    </div>
  )
}

export default Navbar