'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

interface WeatherData {
  temperature: number;
  humidity: number;
  rainfall_probability: number;
  condition: string;
}

interface DashboardStats {
  total_recommendations: number;
  pending_tasks: number;
  weather: WeatherData;
}

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      // Replace with your actual Django API endpoint
      const response = await fetch('http://localhost:8000/api/dashboard/', {
        headers: {
          'Content-Type': 'application/json',
          // Add authentication token if needed
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for development
      setStats({
        total_recommendations: 12,
        pending_tasks: 3,
        weather: {
          temperature: 28,
          humidity: 65,
          rainfall_probability: 30,
          condition: 'Partly Cloudy'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const modules = [
    {
      title: 'Crop Selection',
      description: 'Find the best crops for your farm',
      icon: '🌾',
      href: '/crop-selection',
      color: 'from-green-400 to-green-600'
    },
    {
      title: 'Irrigation',
      description: 'Optimize water usage',
      icon: '💧',
      href: '/irrigation',
      color: 'from-blue-400 to-blue-600'
    },
    {
      title: 'Fertilizer',
      description: 'Get fertilizer recommendations',
      icon: '🧪',
      href: '/fertilizer',
      color: 'from-yellow-400 to-yellow-600'
    },
    {
      title: 'Pest Management',
      description: 'Protect your crops',
      icon: '🐛',
      href: '/pest-management',
      color: 'from-red-400 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your farm overview</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading dashboard...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Recommendations</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.total_recommendations || 0}
                    </p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Tasks</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {stats?.pending_tasks || 0}
                    </p>
                  </div>
                  <div className="text-4xl">⏰</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow p-6 text-white">
                <div>
                  <p className="text-blue-100 text-sm">Current Weather</p>
                  <p className="text-3xl font-bold mt-2">
                    {stats?.weather.temperature}°C
                  </p>
                  <p className="text-sm mt-2">{stats?.weather.condition}</p>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span>💧 {stats?.weather.humidity}%</span>
                    <span>🌧️ {stats?.weather.rainfall_probability}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modules.map((module) => (
                  <Link
                    key={module.title}
                    href={module.href}
                    className="group"
                  >
                    <div className={`bg-gradient-to-br ${module.color} rounded-lg shadow-md hover:shadow-xl transition p-6 text-white h-full`}>
                      <div className="text-4xl mb-3">{module.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                      <p className="text-sm opacity-90">{module.description}</p>
                      <div className="mt-4 text-sm font-medium group-hover:underline">
                        Open →
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">🌾</div>
                      <div>
                        <p className="font-medium text-gray-900">Crop recommendation generated</p>
                        <p className="text-sm text-gray-600">Rice recommended for upcoming season</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">💧</div>
                      <div>
                        <p className="font-medium text-gray-900">Irrigation scheduled</p>
                        <p className="text-sm text-gray-600">Next watering in 2 days</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                      <div className="text-2xl mr-4">🧪</div>
                      <div>
                        <p className="font-medium text-gray-900">Fertilizer analysis complete</p>
                        <p className="text-sm text-gray-600">NPK levels updated</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}