'use client'
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Bot, User } from "lucide-react";

function Chatbot() {
  const router = useRouter();
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I'm your AI farming assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What's the best crop for clay soil?",
    "How often should I irrigate wheat?",
    "Organic pest control methods?",
    "NPK ratio for vegetables?"
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        type: "bot",
        text: "That's a great question! Based on your query, I recommend consulting the relevant section in your dashboard. You can also provide more specific details for a personalized recommendation."
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);

    setInput("");
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-purple-100 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/DashBoard')}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <Bot className="text-purple-600" size={24} />
            <span className="font-bold text-gray-800">AI Farming Assistant</span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6">
        {/* Messages Area */}
        <div className="flex-grow bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="text-purple-600" size={20} />
                  </div>
                )}
                
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.type === "user"
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm sm:text-base">{message.text}</p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <User className="text-indigo-600" size={20} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Questions */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Quick Questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(question)}
                className="px-4 py-2 bg-white rounded-full text-sm text-gray-700 hover:bg-purple-100 hover:text-purple-700 transition-colors shadow-md"
              >
                {question}
              </button>
            ))}
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
              placeholder="Ask me anything about farming..."
              className="flex-grow px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-purple-600 focus:outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Chatbot;