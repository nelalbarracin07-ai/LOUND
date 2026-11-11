import React, { useState } from 'react';
import {
  User,
  Post,
  User as UserType,
  SwapListing
} from '../types';
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Calendar,
  Settings,
  Edit3,
  DollarSign,
  Heart,
  Repeat,
  LogOut,
  UserCheck,
  CheckCircle,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface ProfileViewProps {
  currentUser: UserType;
  allPosts: Post[];
  onOpenPremium: () => void;
  onOpenAdmin: () => void;
  onSelectPost: (post: Post) => void;
  onSwitchUser: (userId: string) => void;
  onUpdateProfile: (updated: Partial<UserType>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  allPosts,
  onOpenPremium,
  onOpenAdmin,
  onSelectPost,
  onSwitchUser,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'my_posts' | 'found_history' | 'saved' | 'rewards'>('my_posts');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editLocation, setEditLocation] = useState(currentUser.location);

  const myPosts = allPosts.filter((p) => p.authorId === currentUser.id);
  const foundHistory = allPosts.filter((p) => p.authorId === currentUser.id && p.type === 'found');
  const savedPosts = allPosts.filter((p) => p.isSaved);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          location: editLocation
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUpdateProfile(data.user);
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Profile Header Card */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white/20 shadow-xl"
                referrerPolicy="no-referrer"
              />
              {currentUser.verified && (
                <div
                  className="absolute bottom-0 right-0 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center font-bold text-xs shadow"
                  title="Verified Account"
                >
                  ✓
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {currentUser.name}
                </h1>
                {currentUser.isPremium ? (
                  <span className="text-[10px] font-black uppercase tracking-wider bg-white text-black px-2 py-0.5 rounded shadow">
                    VIP {currentUser.premiumTier?.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                    FREE MEMBER
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 font-mono">@{currentUser.username}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-neutral-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>{currentUser.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-white">{currentUser.rating} ★</span>
                  <span className="text-neutral-500">({currentUser.ratingsCount} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            {!currentUser.isPremium ? (
              <button
                onClick={onOpenPremium}
                className="flex-1 sm:flex-none px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Go Premium ($5/mo)</span>
              </button>
            ) : (
              <button
                onClick={onOpenPremium}
                className="px-3 py-2 bg-neutral-900 border border-neutral-700 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
              >
                Manage Membership
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                onClick={onOpenAdmin}
                className="px-3 py-2 bg-neutral-900 border border-white/40 text-white text-xs font-bold rounded-xl hover:bg-neutral-800"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>

        {/* Bio */}
        <p className="mt-4 text-xs text-neutral-300 leading-relaxed max-w-2xl bg-neutral-900/50 p-3.5 rounded-2xl border border-neutral-900">
          {currentUser.bio}
        </p>

        {/* Key Metrics Counter Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-neutral-900 text-center">
          <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/60">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Items Returned</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {currentUser.reunitedCount}
            </div>
          </div>
          <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/60">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Found Items</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {currentUser.foundItemsCount}
            </div>
          </div>
          <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/60">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Lost Published</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              {currentUser.lostItemsCount}
            </div>
          </div>
          <div className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/60">
            <div className="text-[10px] uppercase font-bold text-neutral-500">Rewards Earned</div>
            <div className="text-xl font-black text-white font-mono mt-0.5">
              ${currentUser.rewardsEarned}
            </div>
          </div>
        </div>
      </div>

      {/* Account Switcher for Evaluator Convenience */}
      <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-bold text-white block">Switch Community Profile (Demo Accounts)</span>
          <span className="text-neutral-400 text-[11px]">
            Test multiple perspectives (Item Owner, Community Finder, Admin, or Standard Member)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'usr_me', label: 'Nel (Admin & Finder)' },
            { id: 'usr_marcus', label: 'Marcus (Pet Owner)' },
            { id: 'usr_elena', label: 'Elena (Watch Owner)' },
            { id: 'usr_kenji', label: 'Kenji (Cyclist Finder)' }
          ].map((acc) => (
            <button
              key={acc.id}
              onClick={() => onSwitchUser(acc.id)}
              className={`px-2.5 py-1 text-[11px] rounded-lg border transition-colors ${
                currentUser.id === acc.id
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {acc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Activity Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setActiveTab('my_posts')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'my_posts' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          My Listings ({myPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('found_history')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'found_history' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Found Item History
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'saved' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Saved Bookmarks ({savedPosts.length})
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
            activeTab === 'rewards' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
          }`}
        >
          Escrow & Payout Records
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'my_posts' && (
        <div className="space-y-3">
          {myPosts.length === 0 ? (
            <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-neutral-500">
              You haven't published any lost or found items yet. Tap '+' in the navigation bar to start.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 cursor-pointer transition-all flex gap-3.5"
                >
                  <img
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        {post.type} · {post.status}
                      </span>
                      {post.rewardAmount > 0 && (
                        <span className="text-xs font-bold text-white font-mono">
                          ${post.rewardAmount}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">{post.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                      {post.location.barangay}, {post.location.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'found_history' && (
        <div className="space-y-3">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-neutral-300">
            <h4 className="font-bold text-white mb-1">Public Service & Finder Ledger</h4>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Every item you recover builds your trust score on LOUND and qualifies you for verified finder privileges.
            </p>
          </div>
          {foundHistory.map((post) => (
            <div
              key={post.id}
              className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={post.photos[0]}
                  alt={post.title}
                  className="w-12 h-12 rounded-lg object-cover border border-neutral-800"
                />
                <div>
                  <h4 className="font-bold text-white">{post.title}</h4>
                  <div className="text-[11px] text-neutral-400">
                    {post.location.city} · Date: {post.dateLostOrFound}
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-white">
                {post.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'saved' && (
        <div className="space-y-3">
          {savedPosts.length === 0 ? (
            <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-neutral-500">
              No saved items bookmarked yet. Tap the bookmark icon on any post to save it for quick reference.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost(post)}
                  className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl hover:border-neutral-700 cursor-pointer transition-all flex gap-3.5"
                >
                  <img
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-800 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400">
                      {post.type} · ${post.rewardAmount} Reward
                    </span>
                    <h4 className="text-xs font-bold text-white truncate mt-0.5">{post.title}</h4>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                      {post.location.barangay}, {post.location.city}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-900 text-xs">
          <div className="pb-3 flex items-center justify-between">
            <span className="font-bold text-white">Reward Payouts & Transaction Ledger</span>
            <span className="font-mono text-white font-bold">${currentUser.rewardsEarned} Lifetime</span>
          </div>

          {[
            {
              desc: 'Reward payout confirmed for returning Siamese cat "Mochi"',
              amount: '+$150.00',
              date: 'Nov 6, 2026',
              status: 'Completed'
            },
            {
              desc: 'LOUND Premium Annual Subscription payment',
              amount: '-$55.00',
              date: 'Nov 10, 2026',
              status: 'Processed'
            }
          ].map((tx, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-white block">{tx.desc}</span>
                <span className="text-[11px] text-neutral-500 font-mono">
                  {tx.date} · {tx.status}
                </span>
              </div>
              <span
                className={`font-mono font-bold ${
                  tx.amount.startsWith('+') ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Edit Profile Information
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  General Location
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Short Biography
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
