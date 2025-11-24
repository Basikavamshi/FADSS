import Image from "next/image";
import Navbar from "./Navbar";
import Welcome from "./welcome";
export default function Home() {
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

