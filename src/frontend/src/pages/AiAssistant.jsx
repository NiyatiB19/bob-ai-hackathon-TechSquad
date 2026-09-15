import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopHeader from '../components/dashboard/TopHeader';
import { bobSuggestedQuestions, bobAnswersMock } from '../mock/masterMockData';
import { sendBobQuery } from '../services/bobChatService';
import MarkdownRenderer from '../components/common/MarkdownRenderer';
import {
  Bot,
  Send,
  Sparkles,
  User,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Zap,
  Info
} from 'lucide-react';

export default function AiAssistant() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('online');

  const [messages, setMessages] = useState([
    {
      id: 'msg_welcome',
      sender: 'bob',
      text: `Hello! I'm **IBM Bob**, your SupplyGuard AI decision-support assistant.\n\nI can help you analyze shipment risks, route bypass options, fleet asset redeployments, and cold-chain thermal alerts.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      structuredContext: null
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isTyping) return;

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      // Call backend REST API POST /api/bob/query
      const apiResult = await sendBobQuery(query);
      setApiStatus('online');

      const bobMsg = {
        id: 'bob_' + Date.now(),
        sender: 'bob',
        text: apiResult.response || 'Operation complete.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredContext: apiResult.structuredContext || null
      };

      setMessages((prev) => [...prev, bobMsg]);
    } catch (err) {
      console.warn('Backend API connection fallback:', err.message);
      setApiStatus('fallback');

      // Grounded fallback response if backend service is unreachable
      const fallbackText = bobAnswersMock[query] ||
        `⚠️ **SupplyGuard Operational Analysis**\n- **Query Processed:** "${query}"\n- **Primary Status:** Active disruption on primary transit corridor.\n- **Recommendation:** Deploy idle Reefer **FL-002 / T14** via **Southern Bypass Corridor (B12)**.\n- **Expected Benefit:** Saves 2.5 days ETA and avoids congestion bottleneck.`;

      const bobMsg = {
        id: 'bob_' + Date.now(),
        sender: 'bob',
        text: fallbackText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredContext: {
          primaryAffectedShipmentId: 'S102',
          suggestedActionType: 'reroute_and_redeploy',
          riskLevel: 'high',
          rationale: 'Active disruption on primary transit corridor.'
        }
      };

      setMessages((prev) => [...prev, bobMsg]);
    } finally {
      setIsTyping(false);
    }
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
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  apiStatus === 'online'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {apiStatus === 'online' ? 'Live API Connected' : 'Decision-Support Mode'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Operational intelligence assistant for supply chain disruption mitigation & cold-chain emergency response.
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
          <div className="flex-1 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[580px]">
            
            {/* Suggested Question Chips Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Suggested Operational Questions:
              </span>
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {bobSuggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    disabled={isTyping}
                    onClick={() => handleSendMessage(q)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 hover:text-emerald-800 text-xs font-medium whitespace-nowrap transition-all shadow-2xs cursor-pointer flex-shrink-0 disabled:opacity-50"
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
                const ctx = msg.structuredContext;

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

                    {/* Message Bubble & Structured Decision Card */}
                    <div className="space-y-2 max-w-full">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isBob
                            ? 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-none'
                            : 'bg-emerald-600 text-white font-medium rounded-tr-none'
                        }`}
                      >
                        {isBob ? (
                          <MarkdownRenderer content={msg.text} />
                        ) : (
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        )}
                      </div>

                      {/* Structured Decision Card Payload (if present) */}
                      {isBob && ctx && (ctx.primaryAffectedShipmentId || ctx.suggestedActionType) && (
                        <div className="p-3 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-2 text-xs animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center space-x-1.5 text-emerald-400 font-bold text-[11px]">
                              <Zap className="w-3.5 h-3.5" />
                              <span>Structured Decision Action</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                              ctx.riskLevel === 'critical' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-slate-950'
                            }`}>
                              Risk: {ctx.riskLevel || 'high'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {ctx.primaryAffectedShipmentId && (
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Shipment</span>
                                <span className="font-bold text-white font-mono">{ctx.primaryAffectedShipmentId}</span>
                              </div>
                            )}
                            {ctx.suggestedActionType && (
                              <div>
                                <span className="text-slate-400 block text-[10px] uppercase font-mono">Suggested Action</span>
                                <span className="font-bold text-emerald-300 font-mono">{ctx.suggestedActionType}</span>
                              </div>
                            )}
                          </div>

                          {ctx.expectedBenefit && (
                            <div className="text-[11px] text-slate-300">
                              <strong className="text-slate-400">Expected Benefit:</strong> {ctx.expectedBenefit}
                            </div>
                          )}
                        </div>
                      )}

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
                  <span>IBM Bob is querying supply chain telemetry & analyzing decisions...</span>
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
                  disabled={isTyping}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask IBM Bob about risk scores, delays, route bypass options..."
                  className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
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
