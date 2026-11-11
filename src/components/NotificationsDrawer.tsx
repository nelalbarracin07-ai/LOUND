import React, { useState, useEffect } from 'react';
import {
  X,
  Bell,
  MessageCircle,
  Heart,
  Repeat,
  DollarSign,
  ShieldCheck,
  CheckCheck,
  Settings,
  MapPin
} from 'lucide-react';
import { NotificationItem, User } from '../types';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onOpenItem: (notif: NotificationItem) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onOpenItem
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefs, setPrefs] = useState({
    nearbyAlerts: true,
    messages: true,
    rewards: true,
    comments: true,
    swaps: true
  });

  const fetchNotifs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (res.ok && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-4 h-4 text-white" />;
      case 'nearby_alert':
        return <MapPin className="w-4 h-4 text-white" />;
      case 'reward_update':
      case 'recovery_confirmed':
        return <DollarSign className="w-4 h-4 text-white" />;
      case 'swap_proposal':
      case 'swap_status':
        return <Repeat className="w-4 h-4 text-white" />;
      case 'like':
        return <Heart className="w-4 h-4 text-white" />;
      default:
        return <Bell className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
              title="Notification Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preferences Toggle view */}
        {showPreferences ? (
          <div className="p-5 space-y-4 overflow-y-auto">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Alert Preferences
            </h4>
            <div className="space-y-3 text-xs divide-y divide-neutral-900">
              {[
                { key: 'nearbyAlerts', label: 'Nearby Lost Item Alerts', desc: 'Notify when items are reported within 5km' },
                { key: 'rewards', label: 'Reward & Escrow Updates', desc: 'Alerts when funds are escrowed or released' },
                { key: 'messages', label: 'Direct Messages & Inquiries', desc: 'Alerts for private chats from owners/finders' },
                { key: 'swaps', label: 'Item Swap Proposals', desc: 'Alerts when members offer exchanges' },
                { key: 'comments', label: 'Sightings & Post Comments', desc: 'Updates on community reports' }
              ].map((item) => (
                <div key={item.key} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="font-semibold text-white block">{item.label}</span>
                    <span className="text-[11px] text-neutral-400">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={(prefs as any)[item.key]}
                    onChange={(e) =>
                      setPrefs({ ...prefs, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 accent-white rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPreferences(false)}
              className="w-full mt-4 py-2.5 bg-white text-black font-bold text-xs rounded-xl"
            >
              Save Preferences
            </button>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="px-4 py-2 bg-neutral-900/50 border-b border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400 text-[11px]">Real-time activity dispatch</span>
              <button
                onClick={markAllRead}
                className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all as read</span>
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">
                  No notifications yet. You are completely up to date.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onOpenItem(n);
                      onClose();
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      !n.read ? 'bg-neutral-900/40 hover:bg-neutral-900/70' : 'hover:bg-neutral-900/20'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {new Date(n.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{n.body}</p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-white shrink-0 mt-2" />
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
