'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Farmer");

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      router.push('/login');
    } else {
      const user = JSON.parse(currentUser);
      setUserName(`${user.firstName} ${user.lastName}`);
    }
  }, [router]);

  const features = [
    { icon: "🌾", text: "Crop Selection", color: "green-500", bgColor: "green-50", route: "/DashBoard/crop-recommendation" },
    { icon: "💧", text: "Irrigation Scheduling", color: "blue-500", bgColor: "blue-50", route: "/DashBoard/irrigation" },
    { icon: "🌱", text: "Fertilizer Usage", color: "yellow-500", bgColor: "yellow-50", route: "/DashBoard/fertilizer" },
    { icon: "🐛", text: "Pest Management", color: "red-500", bgColor: "red-50", route: "/DashBoard/pest-management" }
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome to Your Farming Dashboard, {userName}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Access all your farming tools and AI-powered recommendations in one place
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              onClick={() => handleNavigation(feature.route)}
              className={`
                flex flex-col items-center justify-center gap-4 p-8
                bg-white rounded-2xl shadow-md 
                hover:shadow-2xl hover:scale-[1.05] 
                transition-all duration-300 cursor-pointer 
                border-2 border-transparent
              `}
            >
              <div className={`text-6xl bg-${feature.bgColor} p-6 rounded-full`}>
                {feature.icon}
              </div>
              <span className="text-gray-800 text-xl font-bold text-center">
                {feature.text}
              </span>
              <p className="text-gray-500 text-sm text-center">
                Click to access {feature.text.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Navbar isDashboard={true} />
      <Dashboard />
    </>
  );
}
