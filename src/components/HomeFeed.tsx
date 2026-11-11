import React, { useState } from 'react';
import {
  Heart,
  Bookmark,
  MessageCircle,
  Share2,
  DollarSign,
  MapPin,
  ShieldCheck,
  UserPlus,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  PhoneCall,
  SlidersHorizontal
} from 'lucide-react';
import { Post, User } from '../types';

interface HomeFeedProps {
  posts: Post[];
  currentUser: User;
  onLikePost: (postId: string) => void;
  onSavePost: (postId: string) => void;
  onOpenComments: (post: Post) => void;
  onContactOwner: (post: Post) => void;
  onClaimReward: (post: Post) => void;
  onOpenPremium: () => void;
  onReportPost: (post: Post) => void;
}

export const HomeFeed: React.FC<HomeFeedProps> = ({
  posts,
  currentUser,
  onLikePost,
  onSavePost,
  onOpenComments,
  onContactOwner,
  onClaimReward,
  onOpenPremium,
  onReportPost
}) => {
  const [feedMode, setFeedMode] = useState<'reel' | 'grid'>('reel');
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const [followedUserIds, setFollowedUserIds] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'lost' | 'found'>('all');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const displayPosts = posts.filter((p) => {
    if (filterType === 'all') return true;
    return p.type === filterType;
  });

  const toggleFollow = (userId: string) => {
    setFollowedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `LOUND - ${post.title}`,
        text: `Help reunite this item on LOUND! Reward: $${post.rewardAmount}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const handleScrollReel = (direction: 'up' | 'down') => {
    if (direction === 'down' && activeReelIndex < displayPosts.length - 1) {
      setActiveReelIndex(activeReelIndex + 1);
    } else if (direction === 'up' && activeReelIndex > 0) {
      setActiveReelIndex(activeReelIndex - 1);
    }
  };

  const currentReelPost = displayPosts[activeReelIndex] || displayPosts[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4">
      {/* Feed Control Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        {/* Type Selector (All / Lost / Found) */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
          <button
            onClick={() => {
              setFilterType('all');
              setActiveReelIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all'
                ? 'bg-white text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => {
              setFilterType('lost');
              setActiveReelIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'lost'
                ? 'bg-white text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => {
              setFilterType('found');
              setActiveReelIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'found'
                ? 'bg-white text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Found Items
          </button>
        </div>

        {/* View Mode Toggle (TikTok Reel vs Grid) */}
        <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => setFeedMode('reel')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              feedMode === 'reel'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Reel Feed</span>
          </button>
          <button
            onClick={() => setFeedMode('grid')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              feedMode === 'grid'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Card Grid</span>
          </button>
        </div>
      </div>

      {displayPosts.length === 0 ? (
        <div className="p-16 text-center bg-neutral-950 border border-neutral-800 rounded-2xl">
          <AlertCircle className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
          <h3 className="text-sm font-bold text-white">No listings found in this filter</h3>
          <p className="text-xs text-neutral-500 mt-1">Switch to "All Items" or publish a new post.</p>
        </div>
      ) : feedMode === 'reel' ? (
        /* ======================== TIKTOK-STYLE REEL VIEW ======================== */
        <div className="relative w-full max-w-md mx-auto aspect-[9/16] max-h-[760px] bg-black rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl flex flex-col justify-between">
          {/* Background Photograph with subtle monochrome zoom */}
          <div className="absolute inset-0">
            <img
              src={currentReelPost.photos[0]}
              alt={currentReelPost.title}
              className="w-full h-full object-cover select-none"
              referrerPolicy="no-referrer"
            />
            {/* Contrast Scrims */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/60 pointer-events-none" />
          </div>

          {/* Top Bar on Reel */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded tracking-wider border ${
                  currentReelPost.type === 'lost'
                    ? 'bg-white text-black border-white'
                    : 'bg-black/80 text-white border-white/40'
                }`}
              >
                {currentReelPost.type}
              </span>
              <span className="text-xs text-white/90 font-medium drop-shadow-md">
                {currentReelPost.category}
              </span>
            </div>

            {currentReelPost.rewardAmount > 0 && (
              <div className="bg-white text-black px-3 py-1 rounded-full font-black text-xs font-mono flex items-center gap-1 shadow-lg">
                <DollarSign className="w-3.5 h-3.5 text-black" />
                <span>${currentReelPost.rewardAmount} REWARD</span>
              </div>
            )}
          </div>

          {/* Right Floating Actions Column (TikTok-inspired) */}
          <div className="relative z-10 self-end p-4 flex flex-col items-center gap-4">
            {/* Author Avatar with Follow toggle */}
            <div className="relative flex flex-col items-center">
              <img
                src={currentReelPost.authorAvatar}
                alt={currentReelPost.authorName}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-lg"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => toggleFollow(currentReelPost.authorId)}
                className="absolute -bottom-1.5 w-5 h-5 bg-white text-black rounded-full flex items-center justify-center text-xs font-black shadow-md hover:scale-110 transition-transform"
                title={followedUserIds.includes(currentReelPost.authorId) ? 'Following' : 'Follow'}
              >
                {followedUserIds.includes(currentReelPost.authorId) ? '✓' : '+'}
              </button>
            </div>

            {/* Like */}
            <button
              onClick={() => onLikePost(currentReelPost.id)}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  currentReelPost.isLiked
                    ? 'bg-white text-black'
                    : 'bg-black/50 text-white group-hover:bg-black/70'
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    currentReelPost.isLiked ? 'fill-black text-black' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-[11px] font-mono font-bold drop-shadow">
                {currentReelPost.likesCount}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={() => onOpenComments(currentReelPost)}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-black/70 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono font-bold drop-shadow">
                {currentReelPost.commentsCount}
              </span>
            </button>

            {/* Save */}
            <button
              onClick={() => onSavePost(currentReelPost.id)}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                  currentReelPost.isSaved
                    ? 'bg-white text-black'
                    : 'bg-black/50 text-white group-hover:bg-black/70'
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    currentReelPost.isSaved ? 'fill-black text-black' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-[11px] font-mono font-bold drop-shadow">
                {currentReelPost.savesCount}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={() => handleShare(currentReelPost)}
              className="flex flex-col items-center gap-1 text-white group"
            >
              <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-black/70 transition-colors">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold drop-shadow">
                {copiedPostId === currentReelPost.id ? 'Copied' : 'Share'}
              </span>
            </button>
          </div>

          {/* Bottom HUD Information */}
          <div className="relative z-10 p-5 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent">
            {/* Author Name and Rating */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-white tracking-wide">
                @{currentReelPost.authorName.replace(/\s+/g, '').toLowerCase()}
              </span>
              <span className="text-neutral-400 font-mono">
                {currentReelPost.authorRating} ★
              </span>
              {currentReelPost.isAuthorVerified && (
                <span className="text-[10px] bg-white text-black px-1.5 py-0.2 rounded font-bold">
                  VERIFIED
                </span>
              )}
            </div>

            {/* Title & Description */}
            <div>
              <h2 className="text-base font-extrabold text-white leading-snug drop-shadow-sm">
                {currentReelPost.title}
              </h2>
              <p className="text-xs text-neutral-300 mt-1 line-clamp-3 leading-relaxed">
                {currentReelPost.description}
              </p>
            </div>

            {/* Location strip */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-300">
              <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="truncate">
                {currentReelPost.location.barangay}, {currentReelPost.location.city}
              </span>
              {currentReelPost.location.isApproximate && (
                <span className="text-[10px] text-neutral-400">(Approx. radius)</span>
              )}
            </div>

            {/* Action Bar */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => onContactOwner(currentReelPost)}
                className="flex-1 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Poster</span>
              </button>

              {currentReelPost.type === 'lost' && (
                <button
                  onClick={() => onClaimReward(currentReelPost)}
                  className="px-4 py-3 bg-neutral-900 border border-white/30 text-white font-bold text-xs uppercase rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  I Found This
                </button>
              )}
            </div>

            {/* Vertical Scroll Navigators */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
              <span>
                Post {activeReelIndex + 1} of {displayPosts.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={activeReelIndex === 0}
                  onClick={() => handleScrollReel('up')}
                  className="p-1 rounded-lg bg-black/60 hover:bg-black text-white disabled:opacity-30 border border-neutral-700"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  disabled={activeReelIndex === displayPosts.length - 1}
                  onClick={() => handleScrollReel('down')}
                  className="p-1 rounded-lg bg-black/60 hover:bg-black text-white disabled:opacity-30 border border-neutral-700"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ======================== CLEAN GRID / CARD VIEW ======================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                <img
                  src={post.photos[0]}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wider border ${
                      post.type === 'lost'
                        ? 'bg-white text-black border-white'
                        : 'bg-black/80 text-white border-white/30'
                    }`}
                  >
                    {post.type}
                  </span>
                  {post.status === 'reunited' && (
                    <span className="bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      ✓ Reunited
                    </span>
                  )}
                </div>

                {post.rewardAmount > 0 && (
                  <div className="absolute top-2.5 right-2.5 bg-white text-black font-black font-mono text-xs px-2.5 py-0.5 rounded shadow">
                    ${post.rewardAmount} REWARD
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1">
                    <span>{post.category}</span>
                    <span>·</span>
                    <span>{post.location.barangay}, {post.location.city}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{post.title}</h3>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {post.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-6 h-6 rounded-full object-cover border border-neutral-800"
                    />
                    <span className="text-neutral-300 font-medium">{post.authorName}</span>
                  </div>

                  <div className="flex items-center gap-3 text-neutral-400">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-white text-white' : ''}`} />
                      <span className="font-mono text-[11px]">{post.likesCount}</span>
                    </button>
                    <button
                      onClick={() => onOpenComments(post)}
                      className="flex items-center gap-1 hover:text-white"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span className="font-mono text-[11px]">{post.commentsCount}</span>
                    </button>
                    <button
                      onClick={() => onContactOwner(post)}
                      className="px-2.5 py-1 bg-white text-black font-bold text-[11px] rounded-lg hover:bg-neutral-200"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Free Tier Sponsored Notice (Removed when user is Premium) */}
      {!currentUser.isPremium && (
        <div className="p-4 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold block">
                Public Lost & Found Sponsor: National Animal Recovery
              </span>
              <span className="text-neutral-400 text-[11px]">
                Support rapid reunification. Remove all sponsored notices with LOUND Premium.
              </span>
            </div>
          </div>
          <button
            onClick={onOpenPremium}
            className="px-4 py-2 bg-neutral-900 border border-neutral-700 hover:border-white text-white font-bold text-xs rounded-xl whitespace-nowrap transition-colors"
          >
            Go Ad-Free ($5/mo)
          </button>
        </div>
      )}
    </div>
  );
};
