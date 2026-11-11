import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Image as ImageIcon,
  Shield,
  AlertTriangle,
  CheckCheck,
  ArrowLeft,
  PhoneOff,
  UserCheck
} from 'lucide-react';
import { Conversation, Message, Post, User } from '../types';

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  activeConversationId?: string | null;
  initialPostRef?: Post | null;
  onReportUser: (targetUser: { id: string; name: string }) => void;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeConversationId,
  initialPostRef,
  onReportUser
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [photoAttachment, setPhotoAttachment] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (res.ok && data.conversations) {
        setConversations(data.conversations);
        if (activeConversationId) {
          const match = data.conversations.find((c: Conversation) => c.id === activeConversationId);
          if (match) setActiveConv(match);
        } else if (!activeConv && data.conversations.length > 0) {
          setActiveConv(data.conversations[0]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, activeConversationId]);

  // Fetch messages for active conversation
  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`);
      const data = await res.json();
      if (res.ok && data.messages) {
        setMessages(data.messages);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
      const interval = setInterval(() => {
        fetchMessages(activeConv.id);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  if (!isOpen) return null;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !photoAttachment) || !activeConv || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/conversations/${activeConv.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim(),
          photoUrl: photoAttachment,
          itemRef: activeConv.itemRef || (initialPostRef ? {
            id: initialPostRef.id,
            title: initialPostRef.title,
            type: initialPostRef.type,
            image: initialPostRef.photos[0],
            rewardAmount: initialPostRef.rewardAmount
          } : undefined)
        })
      });

      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
        setInputText('');
        setPhotoAttachment(null);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get other participant in active conversation
  const getOtherParticipant = (conv: Conversation) => {
    const otherId = conv.participantIds.find((id) => id !== currentUser.id);
    if (!otherId || !conv.participants[otherId]) {
      return { id: 'unknown', name: 'Community Member', avatar: '', username: 'member' };
    }
    return { id: otherId, ...conv.participants[otherId] };
  };

  const partner = activeConv ? getOtherParticipant(activeConv) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-3xl h-full sm:h-[85vh] sm:rounded-2xl flex flex-col sm:flex-row overflow-hidden shadow-2xl">
        {/* Left: Conversations list (collapsible on mobile when activeConv is open) */}
        <div
          className={`${
            activeConv ? 'hidden sm:flex' : 'flex'
          } w-full sm:w-80 flex-col border-r border-neutral-800 bg-neutral-950 h-full`}
        >
          <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Direct Messages</h3>
            <button
              onClick={onClose}
              className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-3 py-2 bg-neutral-900/60 border-b border-neutral-800/80 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <PhoneOff className="w-3.5 h-3.5 text-white" />
            <span>Encrypted P2P relay · Phone numbers hidden</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-900">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                No active conversations yet. Reach out to item owners or finders directly.
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = activeConv?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConv(conv)}
                    className={`w-full p-3.5 flex items-start gap-3 text-left transition-colors ${
                      isSelected ? 'bg-neutral-900 border-l-2 border-white' : 'hover:bg-neutral-900/40'
                    }`}
                  >
                    <img
                      src={other.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={other.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-semibold text-white truncate">
                          {other.name}
                        </span>
                        {conv.lastMessageTime && (
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {conv.lastMessage || 'New connection'}
                      </p>
                      {conv.itemRef && (
                        <div className="mt-1 text-[10px] text-neutral-400 flex items-center gap-1">
                          <span className="uppercase text-[9px] font-bold text-white">
                            [{conv.itemRef.type}]
                          </span>
                          <span className="truncate">{conv.itemRef.title}</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Chat View */}
        <div
          className={`${
            activeConv ? 'flex' : 'hidden sm:flex'
          } flex-1 flex-col h-full bg-black`}
        >
          {activeConv && partner ? (
            <>
              {/* Chat Header */}
              <div className="p-3.5 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConv(null)}
                    className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                    alt={partner.name}
                    className="w-9 h-9 rounded-full object-cover border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{partner.name}</h4>
                      <span className="text-[10px] text-neutral-500">@{partner.username}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                      <span className="text-white">Community Verified</span>
                      <span>·</span>
                      <span>Identity Protected</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onReportUser({ id: partner.id, name: partner.name })}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg text-xs flex items-center gap-1 transition-colors"
                    title="Report Suspicious User"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Report</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Security Advisory Strip */}
              <div className="bg-neutral-900/80 px-4 py-2 border-b border-neutral-800/80 text-[11px] text-neutral-300 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate">
                  Safe Handover: Meet at a police station or lighted mall desk. Never transfer advance funds.
                </span>
              </div>

              {/* Item Reference Card if available */}
              {activeConv.itemRef && (
                <div className="mx-4 mt-3 p-2.5 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center gap-3">
                  <img
                    src={activeConv.itemRef.image}
                    alt={activeConv.itemRef.title}
                    className="w-10 h-10 object-cover rounded-lg border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      Reference Item ({activeConv.itemRef.type})
                    </span>
                    <p className="text-xs font-semibold text-white truncate">
                      {activeConv.itemRef.title}
                    </p>
                  </div>
                </div>
              )}

              {/* Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((m) => {
                  const isMe = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-md rounded-2xl p-3 text-xs leading-relaxed space-y-1.5 ${
                          isMe
                            ? 'bg-white text-black font-medium'
                            : 'bg-neutral-900 text-neutral-100 border border-neutral-800'
                        }`}
                      >
                        {m.photoUrl && (
                          <div className="rounded-xl overflow-hidden mb-1.5 border border-black/10">
                            <img src={m.photoUrl} alt="Shared" className="w-full max-h-56 object-cover" />
                          </div>
                        )}
                        {m.text && <p>{m.text}</p>}
                      </div>
                      <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-neutral-500 font-mono">
                        <span>
                          {new Date(m.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isMe && <CheckCheck className="w-3 h-3 text-neutral-400" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Preview */}
              {photoAttachment && (
                <div className="px-4 py-2 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={photoAttachment} alt="Preview" className="w-10 h-10 rounded object-cover" />
                    <span className="text-xs text-neutral-300">Photo attached for verification</span>
                  </div>
                  <button
                    onClick={() => setPhotoAttachment(null)}
                    className="text-xs text-neutral-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Input Area */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2"
              >
                <label className="w-10 h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center justify-center cursor-pointer text-neutral-400 hover:text-white transition-colors shrink-0">
                  <ImageIcon className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message or arrange a handover..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />

                <button
                  type="submit"
                  disabled={(!inputText.trim() && !photoAttachment) || isSending}
                  className="w-10 h-10 rounded-xl bg-white text-black hover:bg-neutral-200 disabled:opacity-30 transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <Shield className="w-12 h-12 text-neutral-700 mb-3" />
              <h4 className="text-base font-bold text-white mb-1">Select a Conversation</h4>
              <p className="text-xs text-neutral-400 max-w-xs">
                Pick a message thread on the left to coordinate recoveries or discuss item details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
