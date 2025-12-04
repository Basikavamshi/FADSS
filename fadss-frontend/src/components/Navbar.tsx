'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith('/dashboard') || 
                      pathname?.startsWith('/crop-selection') ||
                      pathname?.startsWith('/irrigation') ||
                      pathname?.startsWith('/fertilizer') ||
                      pathname?.startsWith('/pest-management') ||
                      pathname?.startsWith('/chatbot') ||
                      pathname?.startsWith('/notifications') ||
                      pathname?.startsWith('/live-chat');

  const notifications = [
    { id: 1, message: 'Irrigation scheduled for tomorrow', time: '2 hours ago', unread: true },
    { id: 2, message: 'New pest alert in your region', time: '5 hours ago', unread: true },
    { id: 3, message: 'Fertilizer recommendation updated', time: '1 day ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? "/dashboard" : "/"} className="flex items-center cursor-pointer">
            <span className="text-2xl">🌱</span>
            <span className="ml-2 text-xl font-bold text-green-700">FADSS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && isDashboard ? (
              <>
                {/* Dashboard Navigation */}
                <Link href="/dashboard" className="text-gray-700 hover:text-green-600 transition">
                  Dashboard
                </Link>
                
                {/* Chatbot */}
                <button
                  onClick={() => router.push('/chatbot')}
                  className="text-gray-700 hover:text-green-600 transition flex items-center"
                >
                  <span className="mr-1">💬</span>
                  Chatbot
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-gray-700 hover:text-green-600 transition relative"
                  >
                    <span className="text-2xl">🔔</span>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                              notif.unread ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => router.push('/notifications')}
                          >
                            <p className="text-sm text-gray-900">{notif.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button
                          onClick={() => router.push('/notifications')}
                          className="text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Chat */}
                <button
                  onClick={() => router.push('/live-chat')}
                  className="text-gray-700 hover:text-green-600 transition flex items-center"
                >
                  <span className="mr-1">💭</span>
                  Live Chat
                </button>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition"
                  >
                    <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-lg">
                      {user?.avatar || '👤'}
                    </div>
                    <span className="font-medium">{user?.name?.split(' ')[0]}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Phone:</span>
                            <span className="text-gray-900">{user?.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="text-gray-900">{user?.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Farm Area:</span>
                            <span className="text-gray-900">{user?.farm_area} hectares</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Edit Profile
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          router.push('/settings');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Home Navigation */}
                <Link href="/#features" className="text-gray-700 hover:text-green-600 transition">
                  Features
                </Link>
                <Link href="/#how-it-works" className="text-gray-700 hover:text-green-600 transition">
                  How It Works
                </Link>
                {!isAuthenticated && (
                  <Link
                    href="/login"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Login
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}