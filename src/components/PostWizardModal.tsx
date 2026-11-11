import React, { useState } from 'react';
import { X, Plus, Image as ImageIcon, MapPin, DollarSign, ShieldAlert, Sparkles } from 'lucide-react';
import { ItemCategory, Post, PostType, User } from '../types';
import { InteractiveMap } from './InteractiveMap';

interface PostWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPostCreated: (post: Post) => void;
  onOpenPremium: () => void;
}

const CATEGORIES: ItemCategory[] = [
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

export const PostWizardModal: React.FC<PostWizardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  onOpenPremium
}) => {
  const [type, setType] = useState<PostType>('lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Pets & Animals');
  const [description, setDescription] = useState('');
  const [dateLostOrFound, setDateLostOrFound] = useState(new Date().toISOString().split('T')[0]);
  const [country, setCountry] = useState('Philippines');
  const [city, setCity] = useState('Taguig');
  const [barangay, setBarangay] = useState('Bonifacio Global City');
  const [specificAddress, setSpecificAddress] = useState('Near High Street & 7th Ave');
  const [lat, setLat] = useState(14.5518);
  const [lng, setLng] = useState(121.0505);
  const [isApproximate, setIsApproximate] = useState(true);
  const [rewardAmount, setRewardAmount] = useState<number>(100);
  const [photos, setPhotos] = useState<string[]>([
    '/src/assets/images/lost_golden_retriever_1794362026611.jpg'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'location' | 'reward'>('info');

  if (!isOpen) return null;

  // Preset quick photos for lost & found demos
  const presetPhotos = [
    { label: 'Golden Retriever', url: '/src/assets/images/lost_golden_retriever_1794362026611.jpg' },
    { label: 'Vintage Watch', url: '/src/assets/images/lost_vintage_watch_1794362027334.jpg' },
    { label: 'Distressed Wallet', url: '/src/assets/images/found_leather_wallet_1794362026816.jpg' },
    { label: 'Keys Keychain', url: '/src/assets/images/lost_keys_keychain_1794362027618.jpg' },
    { label: 'Smartphone', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80' },
    { label: 'Siamese Cat', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos([reader.result as string, ...photos]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePinSelected = (newLat: number, newLng: number, addressDesc: string) => {
    setLat(newLat);
    setLng(newLng);
    setSpecificAddress(addressDesc);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setErrorMsg('Please complete the title and detailed description.');
      return;
    }

    if (!currentUser.isPremium && currentUser.dailyPostsRemaining <= 0) {
      setErrorMsg('Daily free posting limit reached. Please upgrade to LOUND Premium.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          type,
          category,
          description: description.trim(),
          photos,
          dateLostOrFound,
          location: {
            country,
            city,
            barangay,
            specificAddress,
            lat,
            lng,
            isApproximate
          },
          rewardAmount: type === 'lost' ? Number(rewardAmount) || 0 : 0
        })
      });

      const data = await res.json();
      if (res.ok && data.post) {
        onPostCreated(data.post);
        onClose();
      } else {
        setErrorMsg(data.error || 'Failed to publish post');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while creating post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Publish Listing</span>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-normal">
                {type.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-neutral-400">
              Community lost and found bulletin · Verified instant distribution
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free plan allowance notice */}
        {!currentUser.isPremium && (
          <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs flex items-center justify-between text-neutral-300">
            <span>
              Free tier: <strong className="text-white">{currentUser.dailyPostsRemaining}</strong> daily posts remaining
            </span>
            <button
              onClick={onOpenPremium}
              className="text-white underline font-semibold hover:text-neutral-300"
            >
              Get Unlimited with Premium
            </button>
          </div>
        )}

        {/* Step Tabs */}
        <div className="grid grid-cols-3 border-b border-neutral-800 text-xs font-semibold text-center bg-neutral-950">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 transition-colors ${
              activeTab === 'info'
                ? 'text-white border-b-2 border-white bg-neutral-900/50'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            1. Details & Photos
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 transition-colors ${
              activeTab === 'location'
                ? 'text-white border-b-2 border-white bg-neutral-900/50'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            2. Map & Location
          </button>
          <button
            onClick={() => setActiveTab('reward')}
            className={`py-3 transition-colors ${
              activeTab === 'reward'
                ? 'text-white border-b-2 border-white bg-neutral-900/50'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            3. Reward & Safety
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'info' && (
            <>
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
                  Post Classification
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setType('lost')}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      type === 'lost'
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    I LOST AN ITEM / ANIMAL
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('found')}
                    className={`py-3 rounded-xl border text-xs font-bold transition-all ${
                      type === 'found'
                        ? 'bg-white text-black border-white shadow-md'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    I FOUND AN ITEM / ANIMAL
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Item Name & Identifying Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Missing Golden Retriever 'Rusty' or Found Black Leather Wallet"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ItemCategory)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Date {type === 'lost' ? 'Lost' : 'Discovered'}
                  </label>
                  <input
                    type="date"
                    required
                    value={dateLostOrFound}
                    onChange={(e) => setDateLostOrFound(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white transition-colors"
                  >
                  </input>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Detailed Description & Identifying Marks
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include distinct features, brand, color, serial cues, behavioral traits (for animals), collar details, or circumstances of loss..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
                />
              </div>

              {/* Photo Upload & Presets */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Photographs (Multiple supported)</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {photos.length} attached
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {photos.map((p, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-700">
                      <img src={p} alt="Item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/80 text-white rounded-full flex items-center justify-center text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label className="w-20 h-20 rounded-xl border border-dashed border-neutral-700 hover:border-white bg-neutral-900/50 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                    <Plus className="w-5 h-5 text-neutral-400" />
                    <span className="text-[10px] text-neutral-400 font-medium">Upload</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {/* Quick Presets */}
                <div className="bg-neutral-900/60 border border-neutral-800 p-2.5 rounded-xl">
                  <div className="text-[11px] text-neutral-400 mb-1.5">Or pick a sample item shot:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {presetPhotos.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setPhotos([item.url])}
                        className="text-[10px] px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg border border-neutral-700/60 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'location' && (
            <>
              {/* Interactive Map Picker */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Pin Point Location on Interactive Radar
                </label>
                <InteractiveMap
                  posts={[]}
                  selectedPost={null}
                  onSelectPost={() => {}}
                  isSelectingPin={true}
                  onPinSelected={handlePinSelected}
                />
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    City / Municipality
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Barangay / District
                  </label>
                  <input
                    type="text"
                    required
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Specific Street or Landmark Description
                </label>
                <input
                  type="text"
                  required
                  value={specificAddress}
                  onChange={(e) => setSpecificAddress(e.target.value)}
                  placeholder="e.g. Near Track 30th fountain bench or Starbucks reserve"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              {/* Privacy Shield Toggle */}
              <div className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-start gap-3">
                <input
                  type="checkbox"
                  id="approx"
                  checked={isApproximate}
                  onChange={(e) => setIsApproximate(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-white rounded cursor-pointer"
                />
                <label htmlFor="approx" className="text-xs text-neutral-300 cursor-pointer">
                  <strong className="text-white block mb-0.5">
                    Display Approximate Safety Perimeter (Recommended)
                  </strong>
                  Protects sensitive private addresses and prevents poachers or fraudulent hunters
                  from targeting vulnerable missing animals.
                </label>
              </div>
            </>
          )}

          {activeTab === 'reward' && (
            <>
              {/* Reward Amount */}
              {type === 'lost' ? (
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
                    <span>Finder Incentive Reward Amount (USD $)</span>
                    <span className="text-white font-mono font-bold text-sm">
                      ${rewardAmount}
                    </span>
                  </label>
                  <div className="flex gap-2 mb-3">
                    {[0, 50, 100, 200, 500].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRewardAmount(amt)}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors ${
                          rewardAmount === amt
                            ? 'bg-white text-black border-white'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {amt === 0 ? 'No Reward' : `$${amt}`}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(Number(e.target.value))}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-white"
                    placeholder="Custom reward amount in USD"
                  />
                  <p className="text-[11px] text-neutral-500 mt-1.5 leading-relaxed">
                    Higher reward posts are featured in the <strong>Reward Finder Community</strong> feed and broadcast to local volunteers.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-neutral-300 space-y-2">
                  <h4 className="text-white font-bold">Found-Item Public Service Notice</h4>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    By submitting a found item, you are helping reunite an owner with their valued possession. LOUND does not charge finders any listing fees.
                  </p>
                </div>
              )}

              {/* Anti-Fraud Escrow Safeguard */}
              <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-white text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>LOUND Escrow & Verification Guarantee</span>
                </div>
                <ul className="text-[11px] text-neutral-400 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Rewards are NEVER released automatically.</li>
                  <li>You must personally inspect and confirm receipt before funds are transferred.</li>
                  <li>Our anti-fraud monitors flag suspicious accounts or advance payment requests.</li>
                </ul>
              </div>
            </>
          )}

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
            {activeTab !== 'info' ? (
              <button
                type="button"
                onClick={() =>
                  setActiveTab(activeTab === 'reward' ? 'location' : 'info')
                }
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {activeTab !== 'reward' ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'info' ? 'location' : 'reward')
                  }
                  className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 transition-colors"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 disabled:opacity-40 transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing to LOUND...' : 'Publish to LOUND Network'}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
