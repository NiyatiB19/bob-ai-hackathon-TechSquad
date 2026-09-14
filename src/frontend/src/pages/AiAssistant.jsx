import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { bobSuggestedQuestions, bobAnswersMock } from '../mock/masterMockData';
import { Bot, Send, Sparkles, User, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AiAssistant() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bob',
      text: `Hello! I'm **IBM Bob**, your SupplyGuard AI decision-support assistant.\n\nI can help you analyze shipment risks, route bypass options, fleet asset redeployments, and cold-chain thermal alerts.`,
      time: '10:24 AM'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText =
        bobAnswersMock[query] ||
        `I have analyzed the SupplyGuard AI operational dataset for your query **"${query}"**.\n\n- **Status**: 1 active coastal storm disruption affecting North Sea trade routes.\n- **Recommendation**: Deploy idle Reefer **FL-002** via Southern Bypass Corridor B12 to maintain on-time delivery.`;

      const bobMsg = {
        id: 'bob_' + Date.now(),
        sender: 'bob',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, bobMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans overflow-x-hidden">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="lg:pl-[240px] flex flex-col min-h-screen">
        <TopHeader setMobileOpen={setMobileOpen} />

        <main className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col max-w-[1400px] w-full mx-auto animate-fadeIn">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B192C] font-heading tracking-tight">
                  IBM Bob Decision-Support AI Assistant
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Ready to Assist
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Operational intelligence assistant for supply chain disruption mitigation.
              </p>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Clear Chat</span>
            </button>
          </div>

          {/* Main Chat Window Box */}
          <div className="flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[550px]">
            
            {/* Suggested Question Chips Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Suggested Operational Questions:
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {bobSuggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 text-xs font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer flex-shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isBob = msg.sender === 'bob';

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start space-x-3 max-w-3xl ${
                      isBob ? 'mr-auto' : 'ml-auto flex-row-reverse space-x-reverse'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-xs ${
                        isBob
                          ? 'bg-slate-900 text-emerald-400 border border-slate-800'
                          : 'bg-sky-600 text-white'
                      }`}
                    >
                      {isBob ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>

                    {/* Message Bubble */}
                    <div className="space-y-1">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isBob
                            ? 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none'
                            : 'bg-emerald-600 text-white font-medium rounded-tr-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                      <span className="text-[10px] text-slate-400 block px-1">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium animate-pulse">
                  <Bot className="w-4 h-4 text-emerald-500" />
                  <span>IBM Bob is analyzing supply chain telemetry...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask IBM Bob about risk scores, delays, route bypass options..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
