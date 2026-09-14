import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Calendar,
  Clock,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Menu,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../../services/authService';
import { notificationsMock } from '../../mock/dashboardMock';

export default function TopHeader({ setMobileOpen }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser() || { name: 'Priyanshi Patel', email: 'priyanshi@supplyguard.ai' };

  // Dropdown States
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(notificationsMock);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.isUnread).length;

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'P';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  return (
    <header className="w-full bg-slate-50/90 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left Greeting */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-200/60 focus:outline-none"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600 border border-amber-200 hidden sm:flex">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0B192C] font-heading tracking-tight leading-tight">
              Good Morning, {currentUser.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-500 font-normal leading-none mt-0.5">
              Here's what's happening with your supply chain today.
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls: Date/Time, Notifications, Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        
        {/* Date & Time Widget */}
        <div className="hidden md:flex items-center space-x-3.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 font-medium">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
            <span>Apr 27, 2025</span>
          </div>
          <div className="h-3 w-px bg-slate-200" />
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>10:24 AM</span>
          </div>
        </div>

        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors relative focus:outline-none cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Modal */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden text-xs">
              <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Notifications</span>
                <button
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, isUnread: false })))}
                  className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  Mark all read
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 text-xs transition-colors ${notif.isUnread ? 'bg-sky-50/50' : 'hover:bg-slate-50'}`}
                  >
                    <div className="flex items-start space-x-2">
                      <div className="p-1 rounded bg-amber-100 text-amber-600 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{notif.title}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{notif.detail}</p>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{notif.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 sm:pr-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
              {getInitials(currentUser.name)}
            </div>
            <span className="text-xs font-bold text-slate-800 hidden sm:inline-block">
              {currentUser.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline-block" />
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 text-xs">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-slate-400 text-[11px] truncate">{currentUser.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}
                  className="w-full px-3.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/dashboard'); }}
                  className="w-full px-3.5 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center space-x-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-3.5 py-1.5 text-left text-rose-600 hover:bg-rose-50 font-semibold flex items-center space-x-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
