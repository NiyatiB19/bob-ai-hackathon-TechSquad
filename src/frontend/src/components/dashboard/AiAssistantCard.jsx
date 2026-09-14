import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, ArrowRight } from 'lucide-react';

export default function AiAssistantCard() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-gradient-to-br from-sky-50/70 via-slate-50 to-white border border-sky-200/90 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-sky-600 text-white">
            <Bot className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-[#0B192C] font-heading">
            AI Assistant (IBM Bob)
          </h3>
        </div>

        <button
          onClick={() => navigate('/ai-assistant')}
          className="inline-flex items-center space-x-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
        >
          <span>Chat Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex items-center space-x-3.5 p-3 rounded-lg bg-white border border-slate-200/80">
        <div className="w-11 h-11 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center flex-shrink-0">
          <Bot className="w-6 h-6" />
        </div>

        <div className="space-y-0.5 text-xs">
          <p className="font-bold text-slate-800 text-[11px]">
            I can help you with:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] font-medium text-slate-600">
            <li className="flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-sky-500" />
              <span>Shipment status & delays</span>
            </li>
            <li className="flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-sky-500" />
              <span>Route optimization</span>
            </li>
            <li className="flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-sky-500" />
              <span>Fleet recommendations</span>
            </li>
            <li className="flex items-center space-x-1">
              <span className="w-1 h-1 rounded-full bg-sky-500" />
              <span>Cold chain alerts</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
