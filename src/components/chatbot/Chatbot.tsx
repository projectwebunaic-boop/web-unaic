"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Halo! 👋 Saya Asisten Virtual UNAIC. Pilih topik di bawah atau ketik pertanyaan Anda:',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch dynamic suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (e) {
        console.error("Failed to fetch suggestions");
      }
    };
    fetchSuggestions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.answer,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const errorText = data.details || data.error || 'Maaf, terjadi kesalahan. Silakan coba lagi.';
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorText,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Maaf, tidak dapat terhubung ke server.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-28 z-[60] p-2 md:p-3 rounded-full bg-unaicNavy/80 backdrop-blur-sm text-white border border-unaicGold/70 shadow-lg hover:bg-unaicGold hover:text-unaicNavy transition-all duration-300 hover:scale-110 group md:bottom-44 md:right-6 md:border-2"
        aria-label="Buka chat UNAIC"
      >
        <Bot size={20} className="md:w-6 md:h-6 group-hover:animate-pulse" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-[1050] w-[calc(100vw-2rem)] max-w-sm h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-2 duration-300 font-sans overflow-hidden ring-1 ring-black/5">
          {/* Header */}
          <div className="bg-gradient-to-r from-unaicNavy to-blue-800 text-white p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            {/* Decorative circle */}
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>

            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/10 p-2 rounded-full border border-white/20">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Asisten UNAIC</h3>
                <div className="flex items-center gap-1.5 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-xs font-medium">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
              aria-label="Tutup chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F0F2F5]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-2`}>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${message.sender === 'bot' ? 'bg-gradient-to-br from-blue-100 to-white text-blue-600 border border-blue-50' : 'bg-gray-200 text-gray-500'}`}>
                    {message.sender === 'bot' ? <Bot size={18} /> : <User size={18} />}
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm relative group ${message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'
                      }`}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{message.text}</div>
                    <span className={`text-[10px] mt-1.5 block ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'} text-right`}>
                      {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Suggestions (Shown only if last message is from bot) */}
            {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && !isLoading && (
              <div className="flex flex-wrap gap-2 pl-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs font-medium bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 active:bg-blue-100 px-4 py-2 rounded-full transition-all shadow-sm whitespace-nowrap hover:shadow"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start pl-10">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5 w-16 h-10">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2 relative bg-gray-50 p-1.5 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tulis pesan..."
                className="flex-1 pl-4 pr-2 py-2 text-sm bg-transparent focus:outline-none text-gray-800 placeholder:text-gray-500"
                disabled={isLoading}
              />
              <button
                onClick={() => sendMessage(inputMessage)}
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-all shadow-sm hover:shadow-md transform active:scale-95"
                aria-label="Kirim"
              >
                <Send size={18} className={isLoading ? 'opacity-0' : 'ml-0.5'} />
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                Powered by <span className="font-semibold text-blue-600">UNAIC Intelligence</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-[65] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
