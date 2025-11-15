import React, { useState, useRef, useEffect } from 'react';
import { User, Notification } from '../types';
import { HomeIcon, BellIcon, SearchIcon, VideoCameraIcon, UserIcon } from './icons';

interface HeaderProps {
  currentUser: User;
  onNavigate: (view: 'feed' | 'profile' | 'videos', userId?: number) => void;
  notifications: Notification[];
  users: User[];
  onMarkAsRead: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onNavigate, notifications, users, onMarkAsRead }) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const unreadCount = notifications.filter(n => !n.read).length;
    
    const notificationsPanelRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const togglePanel = () => {
        if (!isPanelOpen) {
            onMarkAsRead();
        }
        setIsPanelOpen(prev => !prev);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target as Node)) {
                setIsPanelOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term.trim() === '') {
            setSearchResults([]);
        } else {
            const filteredUsers = users.filter(user => 
                user.name.toLowerCase().includes(term.toLowerCase()) && user.id !== currentUser.id
            );
            setSearchResults(filteredUsers);
        }
    };

    const handleResultClick = (userId: number) => {
        onNavigate('profile', userId);
        setSearchTerm('');
        setSearchResults([]);
    };

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
          
          <div className="flex-1 max-w-sm mx-4" ref={searchRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="بحث عن مستخدمين..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-slate-700 text-white placeholder-slate-400 px-10 py-2 rounded-full border-2 border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400" />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto">
                    {searchResults.map(user => (
                        <div 
                            key={user.id} 
                            onClick={() => handleResultClick(user.id)}
                            className="flex items-center space-x-3 space-x-reverse p-3 hover:bg-slate-700/50 transition cursor-pointer"
                        >
                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover"/>
                            <span className="text-white font-semibold">{user.name}</span>
                        </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4 space-x-reverse">
            <button onClick={() => onNavigate('feed')} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
              <HomeIcon className="w-7 h-7" />
            </button>
            <button onClick={() => onNavigate('videos')} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
              <VideoCameraIcon className="w-7 h-7" />
            </button>
            <button onClick={() => onNavigate('profile', currentUser.id)} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
              <UserIcon className="w-7 h-7" />
            </button>
            
            <div className="relative" ref={notificationsPanelRef}>
                <button onClick={togglePanel} className="text-slate-300 hover:text-indigo-400 transition p-2 rounded-full">
                    <BellIcon className="w-7 h-7" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {isPanelOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-3 border-b border-slate-700">
                            <h3 className="font-semibold text-white">الإشعارات</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(notif => {
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
            
            <div>
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