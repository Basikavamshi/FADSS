'use client';

import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Expert {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  status: 'online' | 'offline';
}

export default function LiveChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      userId: 'expert1',
      userName: 'Dr. Rajesh Kumar',
      userAvatar: '👨‍🔬',
      message: "Hello! I'm an agricultural expert specializing in pest management. How can I help you today?",
      timestamp: new Date(Date.now() - 300000),
      isOwn: false,
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<string>('expert1');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const experts: Expert[] = [
    {
      id: 'expert1',
      name: 'Dr. Rajesh Kumar',
      avatar: '👨‍🔬',
      specialization: 'Pest Management',
      status: 'online',
    },
    {
      id: 'expert2',
      name: 'Dr. Priya Sharma',
      avatar: '👩‍🌾',
      specialization: 'Crop Selection',
      status: 'online',
    },
    {
      id: 'expert3',
      name: 'Anil Verma',
      avatar: '👨‍🌾',
      specialization: 'Irrigation Expert',
      status: 'offline',
    },
    {
      id: 'expert4',
      name: 'Kavita Singh',
      avatar: '👩‍🔬',
      specialization: 'Soil Specialist',
      status: 'online',
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      userId: user?.id || 'user1',
      userName: user?.name || 'You',
      userAvatar: user?.avatar || '👤',
      message: inputMessage,
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage('');

    // Simulate expert response
    setTimeout(() => {
      const expertResponse: ChatMessage = {
        id: messages.length + 2,
        userId: selectedExpert,
        userName: experts.find(e => e.id === selectedExpert)?.name || 'Expert',
        userAvatar: experts.find(e => e.id === selectedExpert)?.avatar || '👨‍🔬',
        message: generateExpertResponse(inputMessage),
        timestamp: new Date(),
        isOwn: false,
      };
      setMessages((prev) => [...prev, expertResponse]);
    }, 2000);
  };

  const generateExpertResponse = (userMessage: string): string => {
    const responses = [
      "That's a great question! Based on my experience, I would recommend...",
      "I understand your concern. Let me help you with that...",
      "Thank you for sharing those details. Here's what I suggest...",
      "I've encountered similar situations before. The best approach would be...",
      "That's an important issue to address. Let me provide some guidance...",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const currentExpert = experts.find(e => e.id === selectedExpert);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="text-4xl mr-3">💭</span>
            Live Expert Chat
          </h1>
          <p className="text-gray-600 mt-2">
            Connect with agricultural experts for personalized advice
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Experts Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4">
              <h2 className="font-semibold text-gray-900 mb-4">Available Experts</h2>
              <div className="space-y-3">
                {experts.map((expert) => (
                  <button
                    key={expert.id}
                    onClick={() => setSelectedExpert(expert.id)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedExpert === expert.id
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <span className="text-3xl">{expert.avatar}</span>
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                            expert.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></span>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {expert.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {expert.specialization}
                        </p>
                        <p className={`text-xs mt-1 ${
                          expert.status === 'online' ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {expert.status === 'online' ? '● Online' : '○ Offline'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Help Section */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>💡 Tip:</strong> Response time is typically 2-5 minutes during business hours.
                </p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col" style={{ height: '700px' }}>
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">{currentExpert?.avatar}</span>
                    <div>
                      <h3 className="font-semibold">{currentExpert?.name}</h3>
                      <p className="text-sm text-green-100">{currentExpert?.specialization}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-green-500 px-3 py-1 rounded-full">
                      {currentExpert?.status === 'online' ? '● Online' : '○ Offline'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-2xl ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 ${message.isOwn ? 'ml-3' : 'mr-3'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          message.isOwn ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {message.userAvatar}
                        </div>
                      </div>

                      {/* Message Bubble */}
                      <div>
                        <div className={`flex items-center mb-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-xs text-gray-600 font-medium">
                            {message.userName}
                          </span>
                        </div>
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.isOwn
                              ? 'bg-green-600 text-white'
                              : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                        </div>
                        <p className={`text-xs text-gray-500 mt-1 px-2 ${message.isOwn ? 'text-right' : ''}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
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
          </div>
        </div>
      </div>
    </div>
  );
}