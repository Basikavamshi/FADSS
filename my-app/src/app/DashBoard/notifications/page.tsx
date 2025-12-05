'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Check, CheckCheck, Trash2, Filter } from "lucide-react";

function Notifications() {
  const router = useRouter();
  const [filter, setFilter] = useState("all"); // all, unread, read

  const allNotifications = [
    { 
      id: 1, 
      title: "Weather Alert", 
      message: "Heavy rain expected tomorrow. Consider postponing field work and ensure proper drainage.", 
      time: "5 mins ago", 
      unread: true,
      category: "weather",
      priority: "high"
    },
    { 
      id: 2, 
      title: "Pest Warning", 
      message: "Locust activity detected in nearby farms. Immediate action recommended to protect crops.", 
      time: "1 hour ago", 
      unread: true,
      category: "pest",
      priority: "high"
    },
    { 
      id: 3, 
      title: "Irrigation Reminder", 
      message: "Scheduled irrigation for Field A today at 6:00 AM. System will start automatically.", 
      time: "2 hours ago", 
      unread: false,
      category: "irrigation",
      priority: "medium"
    },
    { 
      id: 4, 
      title: "Fertilizer Application Due", 
      message: "Time to apply NPK fertilizer to Field B. Recommended dosage: 130 kg/acre.", 
      time: "5 hours ago", 
      unread: false,
      category: "fertilizer",
      priority: "medium"
    },
    { 
      id: 5, 
      title: "Crop Health Update", 
      message: "Your wheat crop is showing excellent growth. Current health score: 92%.", 
      time: "1 day ago", 
      unread: false,
      category: "crop",
      priority: "low"
    },
    { 
      id: 6, 
      title: "Market Price Alert", 
      message: "Cotton prices increased by 15% this week. Good time to sell your produce.", 
      time: "1 day ago", 
      unread: false,
      category: "market",
      priority: "medium"
    },
    { 
      id: 7, 
      title: "Chatbot Query Resolved", 
      message: "Your question about organic pest control has been answered by our AI assistant.", 
      time: "2 days ago", 
      unread: false,
      category: "chatbot",
      priority: "low"
    },
    { 
      id: 8, 
      title: "System Update", 
      message: "FADSS platform updated with new features. Check out the improved crop recommendation engine.", 
      time: "3 days ago", 
      unread: false,
      category: "system",
      priority: "low"
    }
  ];

  const [notifications, setNotifications] = useState(allNotifications);

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "unread") return notif.unread;
    if (filter === "read") return !notif.unread;
    return true;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const getCategoryColor = (category) => {
    const colors = {
      weather: "blue",
      pest: "red",
      irrigation: "cyan",
      fertilizer: "yellow",
      crop: "green",
      market: "purple",
      chatbot: "indigo",
      system: "gray"
    };
    return colors[category] || "gray";
  };

  const getCategoryIcon = (category) => {
    const icons = {
      weather: "🌤️",
      pest: "🐛",
      irrigation: "💧",
      fertilizer: "🌱",
      crop: "🌾",
      market: "💰",
      chatbot: "🤖",
      system: "⚙️"
    };
    return icons[category] || "📢";
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      setNotifications([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-blue-100 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <CheckCheck size={18} />
              <span className="hidden sm:inline">Mark all as read</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-blue-600" size={40} />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                Notifications
              </h1>
              <p className="text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2 mb-6 flex gap-2">
          {[
            { value: "all", label: "All", count: notifications.length },
            { value: "unread", label: "Unread", count: unreadCount },
            { value: "read", label: "Read", count: notifications.length - unreadCount }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                filter === tab.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Bell size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-600">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  notif.unread ? 'border-l-4 border-blue-500' : 'border-l-4 border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`text-4xl bg-${getCategoryColor(notif.category)}-50 p-3 rounded-xl`}>
                        {getCategoryIcon(notif.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-gray-800 text-lg">{notif.title}</h3>
                          {notif.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                          {notif.priority === "high" && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              High Priority
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{notif.message}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-400">{notif.time}</span>
                          <span className={`text-xs px-2 py-1 bg-${getCategoryColor(notif.category)}-100 text-${getCategoryColor(notif.category)}-700 rounded-full capitalize`}>
                            {notif.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {notif.unread && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;