import React, { useState, useEffect } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { Comment, Post, User } from '../types';

interface CommentsModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCommentAdded: (postId: string, newComment: Comment) => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onCommentAdded
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && post) {
      setIsLoading(true);
      fetch(`/api/posts/${post.id}`)
        .then((res) => res.json())
        .then((data) => {
          setComments(data.comments || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent.trim() })
      });
      const data = await res.json();
      if (res.ok && data.comment) {
        setComments((prev) => [...prev, data.comment]);
        onCommentAdded(post.id, data.comment);
        setNewContent('');
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-white" />
            <h3 className="text-base font-bold text-white">Community Intel & Sightings</h3>
            <span className="text-xs text-neutral-400 font-mono">({comments.length})</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Post Quick Summary */}
        <div className="p-3 bg-neutral-900/60 border-b border-neutral-800/60 flex items-center gap-3">
          <img
            src={post.photos[0]}
            alt={post.title}
            className="w-12 h-12 object-cover rounded-lg border border-neutral-800 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
              {post.type} · {post.category}
            </div>
            <p className="text-xs font-medium text-white truncate">{post.title}</p>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[220px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-neutral-500 text-sm">
              Loading sightings and remarks...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="text-sm font-medium text-neutral-300">No sightings or remarks yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Be the first to share an update or location clue for this item.
              </p>
            </div>
          ) : (
            comments.map((cm) => (
              <div key={cm.id} className="flex gap-3 text-xs">
                <img
                  src={cm.userAvatar}
                  alt={cm.userName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-white">{cm.userName}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {new Date(cm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800/80 rounded-xl p-3 text-neutral-200 leading-relaxed">
                    {cm.content}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Comment input form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-neutral-800 bg-neutral-950 flex items-center gap-2">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Share a sighting, clue or message..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
          />
          <button
            type="submit"
            disabled={!newContent.trim() || isSubmitting}
            className="h-10 px-4 bg-white text-black font-semibold text-xs rounded-xl hover:bg-neutral-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-1 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
