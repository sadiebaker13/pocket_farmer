import React, { useState, useRef, useEffect } from 'react';
import { Sprout, X, Leaf, CloudSun, TrendingUp, ArrowRight, MessageCircle } from 'lucide-react';
import { chatWithAssistant } from '../services/geminiService';

export const FarmAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: "Hi! I'm Pocket, your farm hand. I can help with crop advice, weather, or market prices. What do you need?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Store previous messages to use as history
    const history = [...messages]; 
    
    const newMessages = [...messages, { role: 'user' as const, text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(text, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the network right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-80 sm:w-96 mb-4 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 h-[500px]">
          <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Sprout size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Pocket Assistant</h3>
                <p className="text-xs text-emerald-100">Virtual Farm Hand</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-emerald-100 hover:text-white">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white border border-stone-200 text-stone-700 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-white border border-stone-200 p-3 rounded-2xl rounded-tl-none text-xs text-stone-400 italic shadow-sm">
                   Thinking...
                 </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-stone-100">
             <div className="flex space-x-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
                <button onClick={() => handleSend("What's good to plant now?")} className="flex items-center space-x-1 whitespace-nowrap px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 text-xs font-medium rounded-full transition-colors border border-stone-200">
                  <Leaf size={12} /> <span>Planting Advice</span>
                </button>
                <button onClick={() => handleSend("How's the weather looking for farming?")} className="flex items-center space-x-1 whitespace-nowrap px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 text-xs font-medium rounded-full transition-colors border border-stone-200">
                  <CloudSun size={12} /> <span>Weather</span>
                </button>
                <button onClick={() => handleSend("Current market prices for vegetables?")} className="flex items-center space-x-1 whitespace-nowrap px-3 py-1.5 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-600 text-xs font-medium rounded-full transition-colors border border-stone-200">
                  <TrendingUp size={12} /> <span>Prices</span>
                </button>
             </div>

             <div className="relative">
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                 placeholder="Ask anything..."
                 className="w-full bg-stone-100 border-none rounded-full py-2.5 pl-4 pr-10 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-stone-800 placeholder-stone-400"
               />
               <button 
                 onClick={() => handleSend(input)}
                 disabled={!input.trim() || isLoading}
                 className="absolute right-1 top-1 p-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors"
               >
                 <ArrowRight size={16} />
               </button>
             </div>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};