import React, { useState, useEffect } from 'react';
import {
  Repeat,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRightLeft,
  Sparkles,
  Tag,
  ShieldCheck,
  X
} from 'lucide-react';
import { ItemCategory, SwapListing, SwapProposal, User } from '../types';

interface SwapSectionProps {
  currentUser: User;
  onOpenDirectChat: (targetUserId: string) => void;
}

const SWAP_CATEGORIES: (ItemCategory | 'All')[] = [
  'All',
  'Phones & Electronics',
  'Bags & Wallets',
  'Jewelry & Accessories',
  'Clothing',
  'Keys',
  'Vehicles & Transport',
  'Miscellaneous'
];

export const SwapSection: React.FC<SwapSectionProps> = ({
  currentUser,
  onOpenDirectChat
}) => {
  const [swaps, setSwaps] = useState<SwapListing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Proposal modal state
  const [selectedSwapForProposal, setSelectedSwapForProposal] = useState<SwapListing | null>(null);
  const [offeredTitle, setOfferedTitle] = useState('');
  const [offeredDesc, setOfferedDesc] = useState('');
  const [offeredPhoto, setOfferedPhoto] = useState('');
  const [proposalMsg, setProposalMsg] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState(false);

  // New Swap Creator state
  const [isCreatingSwap, setIsCreatingSwap] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<ItemCategory>('Phones & Electronics');
  const [newDesired, setNewDesired] = useState('');
  const [newCondition, setNewCondition] = useState<'Brand New' | 'Like New' | 'Gently Used' | 'Vintage / Fair'>('Like New');
  const [newPhotos, setNewPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
  ]);
  const [isPublishingSwap, setIsPublishingSwap] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'browse' | 'proposals'>('browse');
  const [userProposals, setUserProposals] = useState<SwapProposal[]>([]);

  const fetchSwaps = async () => {
    setIsLoading(true);
    try {
      const url = new URL('/api/swaps', window.location.origin);
      if (selectedCategory !== 'All') url.searchParams.append('category', selectedCategory);
      if (searchQuery.trim()) url.searchParams.append('search', searchQuery.trim());

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.swaps) {
        setSwaps(data.swaps);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, [selectedCategory, searchQuery]);

  const handleCreateSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesired.trim() || !newDesc.trim()) return;

    setIsPublishingSwap(true);
    try {
      const res = await fetch('/api/swaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          category: newCategory,
          desiredExchange: newDesired.trim(),
          condition: newCondition,
          photos: newPhotos,
          location: currentUser.location
        })
      });
      const data = await res.json();
      if (res.ok && data.swap) {
        setSwaps((prev) => [data.swap, ...prev]);
        setIsCreatingSwap(false);
        setNewTitle('');
        setNewDesc('');
        setNewDesired('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPublishingSwap(false);
    }
  };

  const handleSendProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSwapForProposal || !offeredTitle.trim() || !proposalMsg.trim()) return;

    setIsSubmittingProposal(true);
    try {
      const res = await fetch(`/api/swaps/${selectedSwapForProposal.id}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offeredItemTitle: offeredTitle.trim(),
          offeredItemDescription: offeredDesc.trim(),
          offeredItemPhotos: offeredPhoto ? [offeredPhoto] : [selectedSwapForProposal.photos[0]],
          message: proposalMsg.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setProposalSuccess(true);
        setTimeout(() => {
          setProposalSuccess(false);
          setSelectedSwapForProposal(null);
          setOfferedTitle('');
          setOfferedDesc('');
          setProposalMsg('');
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  const handleProposalStatus = async (proposalId: string, status: 'accepted' | 'rejected' | 'completed') => {
    try {
      const res = await fetch(`/api/swap-proposals/${proposalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setUserProposals((prev) =>
          prev.map((p) => (p.id === proposalId ? { ...p, status } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-white px-2 py-0.5 bg-neutral-900 border border-neutral-800 rounded">
                COMMUNITY EXCHANGE
              </span>
              <span className="text-xs text-neutral-400">· $0 Cash Free Trade</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              LOUND SWAP
            </h1>
            <p className="text-xs text-neutral-400 max-w-lg leading-relaxed">
              Give unneeded belongings a second life. Propose direct item-for-item trades
              with verified members in your city with zero fees.
            </p>
          </div>

          <button
            onClick={() => setIsCreatingSwap(true)}
            className="px-5 py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>List Swap Item</span>
          </button>
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'browse'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Available Swaps ({swaps.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'proposals'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Offers & Active Trades
          </button>
        </div>
      </div>

      {activeTab === 'browse' ? (
        <>
          {/* Search & Category Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items for swap or desired items (e.g., headphones, lens, keyboard)..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Category horizontal scroll */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {SWAP_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors border ${
                    selectedCategory === cat
                      ? 'bg-neutral-100 text-black border-white font-bold'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Swaps Grid */}
          {isLoading ? (
            <div className="py-16 text-center text-xs text-neutral-500">
              Loading available exchanges...
            </div>
          ) : swaps.length === 0 ? (
            <div className="py-16 text-center space-y-2 bg-neutral-950 border border-neutral-800 rounded-2xl">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-neutral-600 mb-2" />
              <h3 className="text-sm font-bold text-white">No items match your criteria</h3>
              <p className="text-xs text-neutral-500">
                Be the first to list an item for exchange or clear your filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {swaps.map((item) => (
                <div
                  key={item.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col"
                >
                  <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                    <img
                      src={item.photos[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-black/85 backdrop-blur-md border border-neutral-800 text-[10px] text-white px-2 py-0.5 rounded font-medium">
                      Condition: {item.condition}
                    </div>
                    <div className="absolute top-2 right-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      {item.status}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-neutral-500 font-semibold mb-1">
                        {item.category} · {item.location}
                      </div>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{item.title}</h3>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Desired Item Box */}
                    <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-1">
                      <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1.5">
                        <Repeat className="w-3 h-3 text-white" />
                        <span>Owner Wants in Return:</span>
                      </div>
                      <p className="text-xs font-semibold text-white">
                        {item.desiredExchange}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.authorAvatar}
                          alt={item.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-neutral-800"
                        />
                        <span className="text-xs text-neutral-300 font-medium">
                          {item.authorName}
                        </span>
                      </div>

                      {item.authorId === currentUser.id ? (
                        <span className="text-[11px] text-neutral-500">Your Listing</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenDirectChat(item.authorId)}
                            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs"
                            title="Chat with owner"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setSelectedSwapForProposal(item)}
                            className="px-3.5 py-1.5 bg-white text-black font-bold text-xs rounded-lg hover:bg-neutral-200 transition-colors"
                          >
                            Propose Trade
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Proposals Section */
        <div className="space-y-4">
          <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-2xl text-xs text-neutral-300 space-y-2">
            <h4 className="font-bold text-white text-sm">Active Exchange Discussions</h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Review barter proposals sent to your listings and trades you offered to other members.
              Once you agree on terms, meet in a public location and mark as Completed.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 divide-y divide-neutral-900 space-y-4">
            {/* Example Active Proposal */}
            <div className="pt-3 first:pt-0 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Trade Proposal for: Keychron K2 Mechanical Keyboard
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Offered: Audio-Technica ATH-M40x Studio Monitor Headphones
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    "Hi Elena! I have an ATH-M40x in pristine shape. Would love to swap for the Keychron K2."
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-white">
                  PENDING
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-neutral-500 font-mono text-[11px]">
                  Submitted yesterday · Safe public handover
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenDirectChat('usr_elena')}
                    className="px-3 py-1.5 bg-neutral-900 text-white border border-neutral-800 rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    Negotiate Chat
                  </button>
                  <button
                    onClick={() => alert('Exchange confirmed and finalized!')}
                    className="px-3.5 py-1.5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors"
                  >
                    Accept Trade
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Propose Swap Modal */}
      {selectedSwapForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Propose Item Exchange
              </h3>
              <button
                onClick={() => setSelectedSwapForProposal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {proposalSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-white text-black rounded-full mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>
                <h4 className="text-base font-bold text-white">Swap Proposal Dispatched!</h4>
                <p className="text-xs text-neutral-400">
                  {selectedSwapForProposal.authorName} has been notified. You can now coordinate
                  further via direct messaging.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendProposal} className="p-5 space-y-4">
                <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
                  <span className="text-neutral-400 text-[10px] block">You are offering for:</span>
                  <strong className="text-white text-sm">{selectedSwapForProposal.title}</strong>
                  <p className="text-neutral-400 mt-0.5 text-[11px]">
                    Owner's wishlist: {selectedSwapForProposal.desiredExchange}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    What item are you offering in return?
                  </label>
                  <input
                    type="text"
                    required
                    value={offeredTitle}
                    onChange={(e) => setOfferedTitle(e.target.value)}
                    placeholder="e.g., Sony WH-1000XM4 Noise Cancelling Headphones"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Item Condition & Specifications
                  </label>
                  <textarea
                    rows={2}
                    value={offeredDesc}
                    onChange={(e) => setOfferedDesc(e.target.value)}
                    placeholder="Describe accessories, wear, box included, or purchase date..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Message to Owner
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={proposalMsg}
                    onChange={(e) => setProposalMsg(e.target.value)}
                    placeholder="Hi! I have this item and am available for a meet-up at BGC or Makati..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSwapForProposal(null)}
                    className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProposal}
                    className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                  >
                    {isSubmittingProposal ? 'Sending Offer...' : 'Send Trade Offer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* New Swap Creator Modal */}
      {isCreatingSwap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                List Item for Swap ($0 Free Exchange)
              </h3>
              <button
                onClick={() => setIsCreatingSwap(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSwap} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Item Name
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Keychron K2 Wireless Keyboard"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ItemCategory)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  >
                    {SWAP_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Condition
                  </label>
                  <select
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Vintage / Fair">Vintage / Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  What are you looking to exchange for? (Desired Item)
                </label>
                <input
                  type="text"
                  required
                  value={newDesired}
                  onChange={(e) => setNewDesired(e.target.value)}
                  placeholder="e.g. Studio Headphones, iPad Mini, or Mountain Bike"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Item Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Include details about specs, condition, box/cables..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingSwap(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingSwap}
                  className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  {isPublishingSwap ? 'Listing...' : 'Publish Swap Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
