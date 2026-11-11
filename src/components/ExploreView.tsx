import React, { useState } from 'react';
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Compass,
  Map as MapIcon,
  Grid,
  Filter,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { ItemCategory, Post, User } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface ExploreViewProps {
  posts: Post[];
  currentUser: User;
  onSelectPost: (post: Post) => void;
  onContactOwner: (post: Post) => void;
  onOpenReport: (post: Post) => void;
}

const CATEGORIES: (ItemCategory | 'All')[] = [
  'All',
  'Phones & Electronics',
  'Bags & Wallets',
  'Jewelry & Accessories',
  'Clothing',
  'Documents & ID',
  'Keys',
  'Vehicles & Transport',
  'Pets & Animals',
  'Miscellaneous'
];

export const ExploreView: React.FC<ExploreViewProps> = ({
  posts,
  currentUser,
  onSelectPost,
  onContactOwner,
  onOpenReport
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'lost' | 'found' | 'reunited'>('all');
  const [rewardOnly, setRewardOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [activePost, setActivePost] = useState<Post | null>(null);

  // Filtered post results
  const filteredPosts = posts.filter((p) => {
    if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (rewardOnly && p.rewardAmount <= 0) return false;
    if (selectedCity !== 'All') {
      const match =
        p.location.city.toLowerCase().includes(selectedCity.toLowerCase()) ||
        p.location.barangay.toLowerCase().includes(selectedCity.toLowerCase());
      if (!match) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.barangay.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-5">
      {/* Search & Filter Header */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost or found items by name, neighborhood, or category..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* View Mode Controls */}
          <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'split' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Split Map & List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'map' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map Only</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid Only</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors border ${
                selectedCategory === cat
                  ? 'bg-neutral-100 text-black border-white font-bold'
                  : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Sub-filters: City & Rewards */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-900 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Area:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              <option value="All">All Locations</option>
              <option value="BGC">Bonifacio Global City</option>
              <option value="Makati">Makati CBD</option>
              <option value="Salcedo">Salcedo Village</option>
              <option value="San Lorenzo">San Lorenzo / Greenbelt</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
              <input
                type="checkbox"
                checked={rewardOnly}
                onChange={(e) => setRewardOnly(e.target.checked)}
                className="w-4 h-4 accent-white rounded"
              />
              <span>Incentive Rewards Only</span>
            </label>

            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-0.5 rounded-lg">
              {(['all', 'lost', 'found', 'reunited'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                    statusFilter === st ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Display Container */}
      <div
        className={`grid gap-6 ${
          viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
        }`}
      >
        {/* Radar Map Component */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div className={viewMode === 'split' ? 'lg:col-span-6' : 'w-full'}>
            <div className="sticky top-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span>Geospatial Radar & Handover Pins</span>
                </span>
                <span className="text-[11px] font-mono">{filteredPosts.length} items mapped</span>
              </div>
              <InteractiveMap
                posts={filteredPosts}
                selectedPost={activePost}
                onSelectPost={(post) => {
                  setActivePost(post);
                  onSelectPost(post);
                }}
              />
            </div>
          </div>
        )}

        {/* Listings Grid / List */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div className={viewMode === 'split' ? 'lg:col-span-6' : 'w-full'}>
            <div className="space-y-3">
              <div className="text-xs text-neutral-400 px-1 font-semibold text-white">
                Discovered Community Items ({filteredPosts.length})
              </div>

              {filteredPosts.length === 0 ? (
                <div className="p-12 text-center bg-neutral-950 border border-neutral-800 rounded-2xl">
                  <AlertCircle className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                  <p className="text-xs text-neutral-400">No items match your specific search.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      onClick={() => {
                        setActivePost(post);
                        onSelectPost(post);
                      }}
                      className={`p-3.5 bg-neutral-950 border rounded-2xl cursor-pointer transition-all flex items-start gap-3.5 ${
                        activePost?.id === post.id
                          ? 'border-white bg-neutral-900/50'
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={post.photos[0]}
                        alt={post.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] uppercase font-bold px-2 py-0.2 rounded border ${
                              post.type === 'lost'
                                ? 'bg-white text-black border-white'
                                : 'bg-neutral-900 text-neutral-200 border-neutral-700'
                            }`}
                          >
                            {post.type}
                          </span>
                          {post.rewardAmount > 0 && (
                            <span className="text-xs font-black text-white font-mono">
                              ${post.rewardAmount} REWARD
                            </span>
                          )}
                        </div>

                        <h3 className="text-xs font-bold text-white truncate">{post.title}</h3>
                        <p className="text-[11px] text-neutral-400 line-clamp-1">
                          {post.description}
                        </p>

                        <div className="flex items-center justify-between pt-1 text-[10px] text-neutral-500">
                          <span>
                            {post.location.barangay}, {post.location.city}
                          </span>
                          <span>{post.dateLostOrFound}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
