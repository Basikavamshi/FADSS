'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your FADSS AI assistant. I can help you with crop recommendations, pest identification, fertilizer advice, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What crops should I plant this season?",
    "How do I identify pest diseases?",
    "When should I irrigate my field?",
    "What fertilizer do I need?",
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('crop') || input.includes('plant')) {
      return "Based on your location and soil conditions, I recommend considering rice, wheat, or cotton for the current season. Would you like me to analyze your specific soil parameters for a more accurate recommendation?";
    } else if (input.includes('pest') || input.includes('disease')) {
      return "I can help identify pests and diseases. You can upload an image of the affected plant in the Pest Management section, or describe the symptoms you're seeing. Common signs include yellowing leaves, brown spots, or wilting.";
    } else if (input.includes('irrigat') || input.includes('water')) {
      return "Irrigation timing depends on your crop stage, soil moisture, and weather forecast. For optimal results, I recommend checking the Irrigation Scheduling tool where I can create a personalized watering schedule based on real-time data.";
    } else if (input.includes('fertilizer') || input.includes('nutrient')) {
      return "Fertilizer needs vary by crop and soil nutrition levels. I suggest getting a soil test done. You can use our Fertilizer Management tool to get specific NPK recommendations based on your soil analysis.";
    } else if (input.includes('weather')) {
      return "Current weather conditions show moderate temperatures with 65% humidity. There's a 30% chance of rainfall in the next 3 days. This is favorable for most crops. Would you like specific advice based on this weather?";
    } else if (input.includes('price') || input.includes('market')) {
      return "Market prices fluctuate regularly. Rice is currently at ₹2,500/quintal, Wheat at ₹2,200/quintal. I recommend checking our dashboard for real-time market trends in your region.";
    } else {
      return "I'm here to help with agricultural decisions. You can ask me about crop selection, irrigation, fertilizers, pest management, weather, or market prices. What would you like to know more about?";
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-4xl mr-3">💬</span>
            AI Farming Assistant
          </h1>
          <p className="text-gray-600 mt-2">
            Ask me anything about farming, crops, pests, or agricultural practices
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-3xl ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 ${message.sender === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                      message.sender === 'user' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {message.sender === 'user' ? '👤' : '🤖'}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div>
                    <div
                      className={`rounded-2xl px-4 py-3 ${
                        message.sender === 'user'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 px-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-3xl">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-blue-100">
                      🤖
                    </div>
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-3">Quick questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-left text-sm px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your question here..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>💡 Tip:</strong> For best results, be specific with your questions. Include details like your crop type, location, and current conditions.
          </p>
        </div>
      </div>
    </div>
  );
}