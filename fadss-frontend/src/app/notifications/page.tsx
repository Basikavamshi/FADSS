'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  time: string;
  read: boolean;
  icon: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Irrigation Reminder',
      message: 'Your field needs watering tomorrow morning. Optimal time: 6-8 AM',
      type: 'info',
      time: '2 hours ago',
      read: false,
      icon: '💧',
    },
    {
      id: 2,
      title: 'Pest Alert',
      message: 'Brown planthopper detected in nearby farms. Check your crops immediately.',
      type: 'alert',
      time: '5 hours ago',
      read: false,
      icon: '🐛',
    },
    {
      id: 3,
      title: 'Weather Update',
      message: 'Heavy rainfall expected in next 48 hours. Prepare drainage systems.',
      type: 'warning',
      time: '8 hours ago',
      read: true,
      icon: '🌧️',
    },
    {
      id: 4,
      title: 'Fertilizer Applied',
      message: 'NPK fertilizer application recorded successfully for Field A.',
      type: 'success',
      time: '1 day ago',
      read: true,
      icon: '🧪',
    },
    {
      id: 5,
      title: 'Market Price Update',
      message: 'Rice prices increased to ₹2,600/quintal. Good time to sell.',
      type: 'success',
      time: '1 day ago',
      read: true,
      icon: '📈',
    },
    {
      id: 6,
      title: 'Crop Recommendation Ready',
      message: 'Your crop analysis for next season is ready to review.',
      type: 'info',
      time: '2 days ago',
      read: true,
      icon: '🌾',
    },
    {
      id: 7,
      title: 'Soil Test Results',
      message: 'Lab results show nitrogen deficiency. Recommendation updated.',
      type: 'warning',
      time: '3 days ago',
      read: true,
      icon: '🔬',
    },
    {
      id: 8,
      title: 'System Maintenance',
      message: 'Scheduled maintenance completed. All features are now available.',
      type: 'info',
      time: '4 days ago',
      read: true,
      icon: '⚙️',
    },
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-4xl mr-3">🔔</span>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-3 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with important farming alerts and reminders
          </p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'unread'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600">No notifications to display</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border-l-4 p-4 transition hover:shadow-md ${
                  getTypeStyles(notification.type)
                } ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    {/* Icon */}
                    <div className="text-3xl mr-4 flex-shrink-0">
                      {notification.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h3>
                      </div>
                      <p className={`text-sm mb-2 ${
                        !notification.read ? 'text-gray-700' : 'text-gray-600'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Settings Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Notification Settings:</strong> You can customize which notifications you receive in your{' '}
            <button className="underline hover:text-blue-700">account settings</button>.
          </p>
        </div>
      </div>
    </div>
  );
}