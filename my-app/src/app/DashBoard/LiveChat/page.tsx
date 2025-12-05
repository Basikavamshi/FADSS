'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Users, Circle } from "lucide-react";

function LiveChat() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { user: "Expert", text: "Welcome to the live chat! Agricultural experts are here to help.", time: "10:00 AM", isExpert: true }
  ]);
  const [input, setInput] = useState("");
  const [activeUsers, setActiveUsers] = useState(23);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const experts = [
    { name: "Dr. Rajesh Kumar", specialty: "Crop Science", status: "online" },
    { name: "Dr. Priya Sharma", specialty: "Pest Management", status: "online" },
    { name: "Mr. Suresh Patel", specialty: "Irrigation", status: "busy" },
    { name: "Ms. Anjali Singh", specialty: "Soil Health", status: "offline" }
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = {
      user: "You",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isExpert: false
    };
    setMessages(prev => [...prev, newMessage]);

    // Simulate expert response
    setTimeout(() => {
      const expertResponse = {
        user: "Expert",
        text: "Thank you for your question. Let me help you with that...",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isExpert: true
      };
      setMessages(prev => [...prev, expertResponse]);
    }, 2000);

    setInput("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex">
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md border-b-2 border-pink-100 px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/DashBoard')}
              className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Circle className="text-green-500 fill-green-500" size={12} />
                <span className="text-sm text-gray-600">{activeUsers} Active Users</span>
              </div>
            </div>
          </div>
        </header>

        {/* Chat Container */}
        <main className="flex-grow flex flex-col p-4 sm:p-6">
          <div className="flex-grow bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${!message.isExpert ? "justify-end" : "justify-start"}`}
                >
                  {message.isExpert && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {message.user[0]}
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] ${!message.isExpert ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-600">{message.user}</span>
                      <span className="text-xs text-gray-400">{message.time}</span>
                    </div>
                    <div
                      className={`p-4 rounded-2xl ${
                        message.isExpert
                          ? "bg-gray-100 text-gray-800"
                          : "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                      }`}
                    >
                      <p className="text-sm sm:text-base">{message.text}</p>
                    </div>
                  </div>

                  {!message.isExpert && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                      Y
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-pink-600 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Send size={20} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Sidebar - Experts List */}
      <aside className="hidden lg:block w-80 bg-white shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="text-pink-600" size={24} />
          <h2 className="text-xl font-bold text-gray-800">Available Experts</h2>
        </div>

        <div className="space-y-4">
          {experts.map((expert, i) => (
            <div
              key={i}
              className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border-2 border-pink-200 hover:border-pink-400 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">{expert.name}</h3>
                <Circle
                  className={`${
                    expert.status === "online"
                      ? "text-green-500 fill-green-500"
                      : expert.status === "busy"
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-400 fill-gray-400"
                  }`}
                  size={12}
                />
              </div>
              <p className="text-sm text-gray-600">{expert.specialty}</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{expert.status}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-pink-100 rounded-xl border-2 border-pink-300">
          <h3 className="font-bold text-pink-800 mb-2">💡 Quick Tip</h3>
          <p className="text-sm text-pink-700">
            Be specific with your questions to get the best advice from our experts!
          </p>
        </div>

        <div className="mt-6 p-4 bg-green-100 rounded-xl border-2 border-green-300">
          <h3 className="font-bold text-green-800 mb-2">🕒 Support Hours</h3>
          <p className="text-sm text-green-700">
            Monday - Saturday<br />
            9:00 AM - 6:00 PM IST
          </p>
        </div>
      </aside>
    </div>
  );
}

export default LiveChat;