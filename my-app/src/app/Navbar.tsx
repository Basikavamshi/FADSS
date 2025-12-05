"use client";
import { useState, useEffect } from "react";
import { Menu, X, Bell, User } from "lucide-react";
import { useRouter } from "next/navigation";

function Navbar({ isDashboard = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isDashboard) {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const user = JSON.parse(currentUser);
        setUserName(`${user.firstName} ${user.lastName}`);
      }
    }
  }, [isDashboard]);

  const notifications = [
    { id: 1, title: "Weather Alert", message: "Heavy rain expected tomorrow", time: "5 mins ago", unread: true },
    { id: 2, title: "Pest Warning", message: "Locust activity detected in nearby farms", time: "1 hour ago", unread: true },
    { id: 3, title: "Irrigation Reminder", message: "Scheduled irrigation for Field A", time: "2 hours ago", unread: false },
  ];

  const navigateToLogin = () => {
    router.push("/login");
  };

  const handleFeatureClick = (feature) => {
    const routeMap = {
      "Chatbot": "/DashBoard/chatbot",
      "Weather": "/DashBoard/weather",
      "Live Chat": "/DashBoard/live-chat",
    };
    router.push(routeMap[feature]);
  };

  const handleNotificationClick = () => {
    if (isDashboard) {
      setShowNotifications(!showNotifications);
    } else {
      navigateToLogin();
    }
  };

  const handleShowAllNotifications = () => {
    router.push("/DashBoard/notifications");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    router.push("/login");
  };

  return (
    <nav className="bg-white shadow-md border-b-2 border-green-100 px-4 sm:px-6 py-4 relative">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <div className="flex-shrink-0">
          <span
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent cursor-pointer"
            onClick={() => router.push(isDashboard ? "/DashBoard" : "/")}
          >
            FADSS
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {["Chatbot", "Weather", "Live Chat"].map((item, i) => (
            <div
              key={i}
              className="group cursor-pointer"
              onClick={() => handleFeatureClick(item)}
            >
              <span className="text-gray-700 font-medium hover:text-green-600 transition-colors duration-200">
                {item}
              </span>
              <div className="h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          ))}

          {/* Desktop Notifications — ONLY ON DASHBOARD */}
          {isDashboard && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="p-2 hover:bg-green-50 rounded-full transition-colors relative"
              >
                <Bell size={22} className="text-gray-700 hover:text-green-600" />
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 border-b border-gray-100 hover:bg-green-50 cursor-pointer transition-colors ${
                          notif.unread ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 text-sm">{notif.title}</h4>
                            <p className="text-gray-600 text-xs mt-1">{notif.message}</p>
                            <p className="text-gray-400 text-xs mt-1">{notif.time}</p>
                          </div>
                          {notif.unread && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-100">
                    <button
                      onClick={handleShowAllNotifications}
                      className="w-full text-center text-green-600 font-semibold text-sm hover:text-green-700 transition-colors"
                    >
                      Show all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile / Login */}
          {isDashboard ? (
            <div className="relative group">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <User size={20} className="text-green-600" />
                <span className="text-gray-700 font-medium">{userName}</span>
              </button>

              {/* Profile Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border-2 border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors">
                    My Profile
                  </button>
                  <button
                    onClick={() => router.push("/DashBoard")}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <span
              onClick={navigateToLogin}
              className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 hover:shadow-lg transition-all duration-300 cursor-pointer inline-block"
            >
              Login
            </span>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden text-gray-700 p-2 hover:bg-green-50 rounded-lg transition"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden mt-4 pb-4 px-2 sm:px-4">
          <div className="flex flex-col gap-4 bg-white rounded-lg shadow-md p-4 border border-green-100">

            {["Chatbot", "Weather", "Live Chat"].map((item, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                onClick={() => handleFeatureClick(item)}
              >
                <span className="text-gray-700 text-lg font-medium hover:text-green-600 transition-colors">
                  {item}
                </span>
                <div className="h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform"></div>
              </div>
            ))}

            {/* Mobile Notifications — ONLY ON DASHBOARD */}
            {isDashboard && (
              <button
                onClick={handleNotificationClick}
                className="flex items-center gap-2 text-gray-700 text-lg font-medium hover:text-green-600 transition-colors"
              >
                <Bell size={20} />
                Notifications
                {notifications.filter((n) => n.unread).length > 0 && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            )}

            {/* Mobile Profile/Login */}
            {isDashboard ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                  <User size={20} className="text-green-600" />
                  <span className="text-gray-700 font-medium">{userName}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white text-center w-full block px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <span
                onClick={navigateToLogin}
                className="bg-green-600 text-white text-center w-full block px-6 py-3 rounded-lg font-medium hover:bg-green-700 hover:shadow-lg transition cursor-pointer"
              >
                Login
              </span>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
