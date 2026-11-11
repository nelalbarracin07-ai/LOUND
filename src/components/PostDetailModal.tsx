import React, { useState } from 'react';
import {
  X,
  MapPin,
  Calendar,
  DollarSign,
  Heart,
  Bookmark,
  Share2,
  MessageCircle,
  PhoneCall,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Flag,
  Sparkles
} from 'lucide-react';
import { Post, User } from '../types';

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onContactOwner: (post: Post) => void;
  onClaimReward: (post: Post) => void;
  onReportPost: (post: Post) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onLikePost,
  onSavePost,
  onOpenComments,
  onContactOwner,
  onClaimReward,
  onReportPost
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !post) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `Lost and Found Item on LOUND: ${post.title}. Reward: $${post.rewardAmount}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded tracking-wider border ${
                post.type === 'lost'
                  ? 'bg-white text-black border-white'
                  : 'bg-neutral-900 text-white border-neutral-700'
              }`}
            >
              {post.type}
            </span>
            <span className="text-xs text-neutral-400 font-semibold">
              {post.category}
            </span>
            {post.status === 'reunited' && (
              <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded font-extrabold uppercase">
                ✓ Reunited
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReportPost(post)}
              className="p-1.5 text-neutral-500 hover:text-white rounded-lg text-xs"
              title="Report Suspicious Post"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main Photo Gallery */}
          <div className="space-y-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={post.photos[activePhotoIdx] || post.photos[0]}
                alt={post.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {post.rewardAmount > 0 && (
                <div className="absolute top-3 right-3 bg-white text-black font-black font-mono text-xs px-3 py-1 rounded-full shadow-lg">
                  ${post.rewardAmount} REWARD
                </div>
              )}
            </div>

            {/* Thumbnail selector if multiple */}
            {post.photos.length > 1 && (
              <div className="flex gap-2">
                {post.photos.map((ph, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      activePhotoIdx === idx ? 'border-white' : 'border-neutral-800 opacity-60'
                    }`}
                  >
                    <img src={ph} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Author Info */}
          <div>
            <h1 className="text-xl font-black text-white leading-tight">{post.title}</h1>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-800"
                />
                <div className="text-xs">
                  <span className="font-bold text-white block">{post.authorName}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {post.authorRating} ★ rating · Verified Member
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    post.isLiked
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-black' : ''}`} />
                </button>
                <button
                  onClick={() => onSavePost(post.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    post.isSaved
                      ? 'bg-white text-black border-white'
                      : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${post.isSaved ? 'fill-black' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded-xl transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-neutral-400" />
                <span>Date Recorded</span>
              </div>
              <p className="font-semibold text-white font-mono">{post.dateLostOrFound}</p>
            </div>

            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
              <div className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span>Location Perimeter</span>
              </div>
              <p className="font-semibold text-white truncate">
                {post.location.barangay}, {post.location.city}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Identifying Description & Intel
            </h4>
            <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
              {post.description}
            </p>
          </div>

          {/* Safety & Animal Protection Notice */}
          <div className="p-3.5 bg-neutral-900/40 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-xs text-neutral-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-[11px] mb-0.5">
                Community Protection Protocol:
              </strong>
              <span>
                To prevent fraud or animal trafficking, precise coordinates are shielded with an approximate safety zone.
                Coordinate handovers in daylight at well-lit commercial reception desks or police substations.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center gap-3">
          <button
            onClick={() => onOpenComments(post)}
            className="px-4 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comments ({post.commentsCount})</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onContactOwner(post);
            }}
            className="flex-1 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Message Owner</span>
          </button>

          {post.type === 'lost' && (
            <button
              onClick={() => {
                onClose();
                onClaimReward(post);
              }}
              className="px-4 py-3 bg-neutral-900 border border-white/30 text-white font-bold text-xs uppercase rounded-xl hover:bg-neutral-800 transition-colors"
            >
              Report Sighting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
