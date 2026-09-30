import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, LogOut, CheckCircle2, AlertTriangle, Info, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/appServices';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick, onSearch, searchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      if (user) {
        const data = await notificationService.getNotifications();
        setNotifications(data || []);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 border-b border-slate-200 glass-header">
      {/* Left side - Menu toggle & Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onMenuClick}
          className="p-2 text-slate-600 rounded-xl hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search facilities, inspections, violations..."
            value={searchQuery || ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right side - Notifications & User Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700 font-bold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3.5 flex gap-3 hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'danger' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {n.type === 'info' && <Info className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-1.5">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
