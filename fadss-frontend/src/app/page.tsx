'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Crop Selection',
      description: 'Get AI-powered recommendations for the best crops based on soil, weather, and market trends',
      icon: '🌾',
      href: '/crop-selection',
      color: 'bg-green-500'
    },
    {
      title: 'Irrigation Scheduling',
      description: 'Optimize water usage with smart irrigation schedules based on weather and soil moisture',
      icon: '💧',
      href: '/irrigation',
      color: 'bg-blue-500'
    },
    {
      title: 'Fertilizer Management',
      description: 'Receive precise fertilizer recommendations based on soil nutrient analysis',
      icon: '🧪',
      href: '/fertilizer',
      color: 'bg-yellow-500'
    },
    {
      title: 'Pest Management',
      description: 'Early pest detection and management strategies to protect your crops',
      icon: '🐛',
      href: '/pest-management',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Farmer Advisory & Decision Support System
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Make data-driven agricultural decisions with AI-powered recommendations 
            for crop selection, irrigation, fertilizer usage, and pest management
          </p>
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-lg"
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Our Services
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
            >
              <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h4>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-3">Input Your Data</h4>
              <p className="text-gray-600">
                Provide information about your soil, location, and farming conditions
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-3">AI Analysis</h4>
              <p className="text-gray-600">
                Our ML models analyze weather, soil, and market data
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-3">Get Recommendations</h4>
              <p className="text-gray-600">
                Receive personalized, actionable farming recommendations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 FADSS. All rights reserved.</p>
          <p className="mt-2 text-gray-400">
            Empowering farmers with data-driven decisions
          </p>
        </div>
      </footer>
    </div>
  );
}