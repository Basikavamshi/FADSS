'use client'
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("Farmer");

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
      // If no user is logged in, redirect to login
      
    } else {
      const user = JSON.parse(currentUser);
      setUserName(`${user.firstName} ${user.lastName}`);
    }
  }, [router]);

  const features = [
    { 
      icon: "🌾", 
      text: "Crop Selection", 
      color: "green-500",
      bgColor: "green-50",
      route: "/DashBoard/crop-recommendation"
    },
    { 
      icon: "💧", 
      text: "Irrigation Scheduling", 
      color: "blue-500",
      bgColor: "blue-50",
      route: "/DashBoard/irrigation"
    },
    { 
      icon: "🌱", 
      text: "Fertilizer Usage", 
      color: "yellow-500",
      bgColor: "yellow-50",
      route: "/DashBoard/fertilizer"
    },
    { 
      icon: "🐛", 
      text: "Pest Management", 
      color: "red-500",
      bgColor: "red-50",
      route: "/DashBoard/pest-management"
    },
    { 
      icon: "🤖", 
      text: "AI Chatbot", 
      color: "purple-500",
      bgColor: "purple-50",
      route: "/DashBoard/Chatbot"
    },
    { 
      icon: "🌤️", 
      text: "Weather Forecast", 
      color: "cyan-500",
      bgColor: "cyan-50",
      route: "/DashBoard/Wheather"
    },
    { 
      icon: "💬", 
      text: "Live Chat", 
      color: "pink-500",
      bgColor: "pink-50",
      route: "/DashBoard/LiveChat"
    },
  ];

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  const handleLogout = () => {
    // Remove current user from localStorage
    localStorage.removeItem('currentUser');
    // Navigate to login page
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <Navbar/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Welcome to Your Farming Dashboard
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Access all your farming tools and AI-powered recommendations in one place
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              onClick={() => handleNavigation(feature.route)}
              className={`
                flex flex-col items-center justify-center gap-4 p-8
                bg-white rounded-2xl shadow-md 
                hover:shadow-2xl hover:scale-[1.05] 
                transition-all duration-300 cursor-pointer 
                border-2 border-transparent hover:border-${feature.color}
                group
              `}
            >
              <div className={`text-6xl bg-${feature.bgColor} p-6 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <span className={`text-gray-800 text-xl font-bold text-center group-hover:text-${feature.color} transition-colors duration-300`}>
                {feature.text}
              </span>
              <p className="text-gray-500 text-sm text-center">
                Click to access {feature.text.toLowerCase()}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Active Recommendations</h3>
            <p className="text-3xl font-bold text-gray-800">12</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Alerts</h3>
            <p className="text-3xl font-bold text-gray-800">3</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Farm Health Score</h3>
            <p className="text-3xl font-bold text-gray-800">87%</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;