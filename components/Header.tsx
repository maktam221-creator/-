import React, { useState, useRef, useEffect } from 'react';
import { User, Notification } from '../types';
import { HomeIcon, BellIcon } from './icons';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: 'feed' | 'profile', userId?: number) => void;
  notifications: Notification[];
  users: User[];
  onMarkAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, notifications, users, onMarkAsRead }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;
    const panelRef = useRef<HTMLDivElement>(null);

    const togglePanel = () => {
        if (!isPanelOpen) {
            onMarkAsRead();
        }
        setIsPanelOpen(prev => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsPanelOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [panelRef]);

    const getActor = (actorId: number) => users.find(u => u.id === actorId);

    return (
    <header className="bg-slate-800/80 backdrop-blur-sm sticky top-0 z-20 shadow-lg mb-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div 
            className="flex items-center space-x-2 space-x-reverse cursor-pointer group"
            onClick={() => onNavigate('feed')}
          >
             <svg className="w-8 h-8 text-indigo-500 group-hover:animate-pulse" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
            <h1 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">منشورات</h1>
          </div>
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => onNavigate('feed')} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
              <HomeIcon className="w-7 h-7" />
            </button>
            
            <div className="relative" ref={panelRef}>
                <button onClick={togglePanel} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
                    <BellIcon className="w-7 h-7" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {isPanelOpen && (
                    <div className="absolute left-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b border-slate-700">
                            <h3 className="font-semibold text-white">الإشعارات</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => {
                                    const actor = getActor(notif.actorId);
                                    if (!actor) return null;
                                    const message = notif.type === 'like' 
                                        ? 'أعجب بمنشورك.' 
                                        : 'علّق على منشورك.';
                                    return (
                                        <div key={notif.id} className={`flex items-start space-x-3 space-x-reverse p-3 hover:bg-slate-700/50 transition cursor-pointer border-b border-slate-700/50 ${!notif.read ? 'bg-indigo-900/20' : ''}`}>
                                            <img src={actor.avatar} alt={actor.name} className="w-10 h-10 rounded-full object-cover" />
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-200">
                                                    <span className="font-bold">{actor.name}</span> {message}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(notif.timestamp).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-slate-400 text-center p-6">لا توجد إشعارات جديدة.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="cursor-pointer" onClick={() => onNavigate('profile', currentUser.id)}>
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-600 hover:border-indigo-500 transition"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
