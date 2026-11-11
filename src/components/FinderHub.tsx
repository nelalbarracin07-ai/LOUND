import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Award,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { ItemCategory, Post, RewardClaim, User } from '../types';

interface FinderHubProps {
  currentUser: User;
  onSelectPost: (post: Post) => void;
  onSubmitReport: (post: Post) => void;
  onOpenDirectChat: (targetUserId: string, postRef?: Post) => void;
}

export const FinderHub: React.FC<FinderHubProps> = ({
  currentUser,
  onSelectPost,
  onSubmitReport,
  onOpenDirectChat
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [claims, setClaims] = useState<RewardClaim[]>([]);
  const [minReward, setMinReward] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDistance, setSelectedDistance] = useState<number>(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'bounties' | 'claims' | 'leaderboard'>('bounties');

  const fetchFinderData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/rewards/board');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
        setClaims(data.claims || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinderData();
  }, []);

  // Filter posts based on current controls
  const filteredPosts = posts.filter((p) => {
    if (minReward > 0 && p.rewardAmount < minReward) return false;
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOwnerConfirmRecovery = async (claimId: string) => {
    try {
      const res = await fetch(`/api/rewards/claims/${claimId}/confirm`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        alert('Recovery verified! The reward has been officially released to the finder.');
        fetchFinderData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-black bg-white px-2 py-0.5 rounded">
                REWARD PATROL
              </span>
              <span className="text-xs text-neutral-400">· Verified Escrow Pool</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              REWARD FINDER COMMUNITY
            </h1>
            <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
              Earn financial rewards by recovering lost items and missing animals for neighbors.
              All rewards are held in escrow and released upon owner verification.
            </p>
          </div>

          {/* User Finder Stats Card */}
          <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-6 shrink-0">
            <div>
              <div className="text-[10px] uppercase text-neutral-400 font-semibold">Your Earned Rewards</div>
              <div className="text-xl font-black text-white font-mono">
                ${currentUser.rewardsEarned}
              </div>
            </div>
            <div className="h-8 w-px bg-neutral-800" />
            <div>
              <div className="text-[10px] uppercase text-neutral-400 font-semibold">Verified Recoveries</div>
              <div className="text-xl font-black text-white font-mono">
                {currentUser.reunitedCount} Items
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('bounties')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'bounties' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Active Reward Listings ({filteredPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'claims' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Recovery Reports & Escrow ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'leaderboard' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Finder Reputation Ranks
        </button>
      </div>

      {activeTab === 'bounties' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reward posts by item, breed, or landmark..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white"
                />
              </div>

              {/* Reward minimum pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {[0, 50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setMinReward(amt)}
                    className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-colors font-mono ${
                      minReward === amt
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {amt === 0 ? 'All Rewards' : `$${amt}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Distance and Category row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-900 text-xs">
              <div className="flex items-center gap-2 text-neutral-400">
                <span>Radius:</span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={selectedDistance}
                  onChange={(e) => setSelectedDistance(Number(e.target.value))}
                  className="w-24 accent-white cursor-pointer"
                />
                <span className="text-white font-mono">{selectedDistance} km</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white"
                >
                  <option value="All">All Categories</option>
                  <option value="Pets & Animals">Pets & Animals</option>
                  <option value="Jewelry & Accessories">Jewelry & Accessories</option>
                  <option value="Phones & Electronics">Phones & Electronics</option>
                  <option value="Bags & Wallets">Bags & Wallets</option>
                  <option value="Keys">Keys</option>
                </select>
              </div>
            </div>
          </div>

          {/* Listings List */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-2xl">
              <DollarSign className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No active reward listings match your filters</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try widening your distance radius or lowering the minimum reward filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img
                      src={post.photos[0]}
                      alt={post.title}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-neutral-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                        <span className="text-white font-semibold">{post.category}</span>
                        <span>·</span>
                        <span>{post.location.barangay}, {post.location.city}</span>
                        <span>·</span>
                        <span>{post.dateLostOrFound}</span>
                      </div>
                      <h3
                        onClick={() => onSelectPost(post)}
                        className="text-sm font-bold text-white hover:underline cursor-pointer truncate"
                      >
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </div>

                  {/* Reward callout and action buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-neutral-900">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                        Owner Escrow Reward
                      </div>
                      <div className="text-2xl font-black text-white font-mono">
                        ${post.rewardAmount}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenDirectChat(post.authorId, post)}
                        className="p-2 bg-neutral-900 text-neutral-300 hover:text-white rounded-xl border border-neutral-800"
                        title="Chat with owner"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onSubmitReport(post)}
                        className="px-4 py-2 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-neutral-200 transition-colors shadow"
                      >
                        I Found This Item
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'claims' && (
        <div className="space-y-4">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>Escrow Protection & Recovery Handover Queue</span>
            </h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              When an item is discovered, the finder submits physical verification photos. The item's owner
              personally verifies possession during handover and clicks "Confirm Safe Recovery" to transfer the reward.
            </p>
          </div>

          <div className="space-y-3">
            {claims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      Report ID: {claim.id}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{claim.postTitle}</h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Finder: <strong className="text-white">{claim.finderName}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        claim.status === 'confirmed_by_owner'
                          ? 'bg-neutral-100 text-black border-white'
                          : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                      }`}
                    >
                      {claim.status === 'confirmed_by_owner' ? 'PAID & CONFIRMED' : 'PENDING REVIEW'}
                    </span>
                    <div className="text-lg font-black text-white font-mono mt-1">
                      ${claim.rewardAmount}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900/60 border border-neutral-800 rounded-xl text-xs space-y-1.5 text-neutral-300">
                  <div>
                    <span className="text-neutral-500 font-semibold">Proof description: </span>
                    <span>{claim.proofDescription}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 font-semibold">Handover point: </span>
                    <span className="text-white">{claim.recoveryLocation}</span>
                  </div>
                </div>

                {claim.status === 'pending' && (
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-900 text-xs">
                    <span className="text-neutral-500 text-[11px]">
                      Awaiting owner in-person inspection
                    </span>
                    <button
                      onClick={() => handleOwnerConfirmRecovery(claim.id)}
                      className="px-4 py-2 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Safe Recovery & Release ${claim.rewardAmount}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Top Community Recovery Finders</h3>
              <p className="text-xs text-neutral-400">Ranked by verified reunifications & ratings</p>
            </div>
            <Award className="w-5 h-5 text-white" />
          </div>

          <div className="divide-y divide-neutral-900">
            {[
              { rank: 1, name: 'Nel Albarracin', role: 'Chief Volunteer', recovered: 12, rating: 4.96, rewards: '$750' },
              { rank: 2, name: 'Kenji Sato', role: 'Active Cyclist', recovered: 7, rating: 5.0, rewards: '$450' },
              { rank: 3, name: 'Marcus Vance', role: 'BGC Resident', recovered: 5, rating: 4.88, rewards: '$300' },
              { rank: 4, name: 'Elena Rostova', role: 'Makati Volunteer', recovered: 3, rating: 4.92, rewards: '$200' }
            ].map((user) => (
              <div key={user.rank} className="py-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 font-mono font-bold text-neutral-400 text-sm">
                    #{user.rank}
                  </span>
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>{user.name}</span>
                      <span className="text-[10px] text-neutral-500 font-normal">
                        ({user.role})
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {user.recovered} items returned · {user.rating} ★ Rating
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm">{user.rewards}</span>
                  <span className="block text-[10px] text-neutral-500">Earned</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
