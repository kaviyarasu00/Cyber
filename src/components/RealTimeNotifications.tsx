import { useState, useEffect, useCallback } from 'react';
import { Bell, X, User, Trophy, MessageSquare, Calendar, Zap } from 'lucide-react';

interface Notification {
  id: string;
  type: 'user' | 'event' | 'message' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function RealTimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Simulate real-time notifications
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'event',
        title: 'CTF Starting Soon',
        message: 'Midnight Heist begins in 30 minutes!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        read: false,
      },
      {
        id: '2',
        type: 'achievement',
        title: 'New Badge Earned',
        message: 'You earned the "First Login" badge!',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        read: false,
      },
    ];
    setNotifications(initialNotifications);
    setUnreadCount(2);

    // Simulate incoming notifications
    const interval = setInterval(() => {
      const randomNotifications = [
        { type: 'user' as const, title: 'New Member', message: 'Alex joined the community!' },
        { type: 'message' as const, title: 'New Message', message: 'Someone replied to your post' },
        { type: 'event' as const, title: 'Event Update', message: 'Workshop rescheduled to 3 PM' },
        { type: 'achievement' as const, title: 'Points Earned', message: 'You earned 50 points!' },
      ];

      if (Math.random() > 0.7) {
        const random = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...random,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 10));
        setUnreadCount(prev => prev + 1);
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    const wasUnread = notifications.find(n => n.id === id)?.read === false;
    if (wasUnread) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'user': return <User className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'achievement': return <Trophy className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'user': return 'text-blue-500 bg-blue-100';
      case 'event': return 'text-green-600 bg-green-100';
      case 'message': return 'text-yellow-600 bg-yellow-100';
      case 'achievement': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#A6A9B6] hover:text-[#39FF14] transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#39FF14] text-[#05060B] rounded-full text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="font-orbitron font-bold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="font-mono text-sm text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : 'bg-white'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-gray-900 font-medium">
                          {notification.title}
                        </p>
                        <p className="font-mono text-xs text-gray-600 truncate">
                          {notification.message}
                        </p>
                        <p className="font-mono text-xs text-gray-400 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"
                      />
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 text-center bg-gray-50">
              <button className="font-mono text-xs text-blue-600 hover:text-blue-800 hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}