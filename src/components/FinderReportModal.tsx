import React, { useState } from 'react';
import { X, CheckCircle, Upload, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { Post, User } from '../types';

interface FinderReportModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onClaimSubmitted: (claim: any) => void;
}

export const FinderReportModal: React.FC<FinderReportModalProps> = ({
  post,
  isOpen,
  onClose,
  currentUser,
  onClaimSubmitted
}) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !post) return null;

  const sampleProofPhotos = [
    post.photos[0],
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !location.trim()) {
      setErrorMsg('Please describe your discovery and specific secure handover location.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/rewards/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          proofDescription: description.trim(),
          recoveryLocation: location.trim(),
          proofPhotoUrl: photoUrl || post.photos[0]
        })
      });

      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        onClaimSubmitted(data.claim);
        setTimeout(() => {
          setIsSuccess(false);
          setDescription('');
          setLocation('');
          setPhotoUrl('');
          onClose();
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Submit Found-Item Recovery Report
              </h3>
              <p className="text-[11px] text-neutral-400">
                Official recovery claim for owner verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-white text-black rounded-full mx-auto flex items-center justify-center text-2xl font-bold">
              ✓
            </div>
            <h4 className="text-lg font-bold text-white">Recovery Report Transmitted!</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              The owner ({post.authorName}) has received your recovery notice. Once they inspect and confirm
              the item in person, the ${post.rewardAmount} reward will be released to your finder account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Target Post Banner */}
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3">
              <img
                src={post.photos[0]}
                alt={post.title}
                className="w-12 h-12 rounded-lg object-cover border border-neutral-800 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-white tracking-wider">
                    {post.type}
                  </span>
                  {post.rewardAmount > 0 && (
                    <span className="text-[11px] font-bold text-black bg-white px-1.5 py-0.2 rounded font-mono">
                      ${post.rewardAmount} REWARD
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-semibold text-neutral-200 truncate">{post.title}</h4>
                <p className="text-[10px] text-neutral-400">Owner: {post.authorName}</p>
              </div>
            </div>

            {/* Verification Proof Guidelines */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-3 flex gap-2.5 text-xs text-neutral-300">
              <AlertTriangle className="w-4 h-4 text-white shrink-0 mt-0.5" />
              <div className="space-y-1 text-[11px] leading-relaxed">
                <strong className="text-white block">Anti-Fraud Safeguard Notice:</strong>
                <span>
                  Never ask the owner for advance fees or wire transfers. Arrange verification in a secure, well-lit public commercial or police station.
                </span>
              </div>
            </div>

            {/* Discovery Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Discovery Details & Condition
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Where did you spot/secure the item? Describe its current condition, distinctive markings or collar tags to verify identity..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Handover Location */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <span>Suggested Safe Handover Point / Current Location</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Security Desk at Greenbelt 5 or BGC Police Station"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Photo Proof Upload */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-neutral-400" />
                <span>Verification Photo (Proof of Possession)</span>
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-neutral-200 cursor-pointer"
                />
                {photoUrl && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-neutral-700">
                    <img src={photoUrl} alt="Proof" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 p-2.5 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-neutral-800 text-neutral-400 hover:text-white rounded-xl text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-white text-black font-bold rounded-xl text-xs hover:bg-neutral-200 transition-colors disabled:opacity-40 flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting Report...' : 'Transmit Recovery Report'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
