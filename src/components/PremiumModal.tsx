import React, { useState } from 'react';
import { X, Check, ShieldCheck, Zap, Sparkles, CreditCard } from 'lucide-react';
import { User } from '../types';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSubscriptionUpdated: (updatedUser: User) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubscriptionUpdated
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedPlan })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setSuccessMessage(`Subscribed to LOUND Premium (${selectedPlan})!`);
        onSubscriptionUpdated(data.user);
        setTimeout(() => {
          setSuccessMessage('');
          onClose();
        }, 1800);
      } else {
        setErrorMsg(data.error || 'Payment transaction failed');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error while processing subscription');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel your LOUND Premium subscription?')) return;
    setIsProcessing(true);
    try {
      const res = await fetch('/api/subscription/cancel', {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onSubscriptionUpdated(data.user);
        alert('Your subscription has been cancelled. Switched to Free membership.');
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-base font-bold text-white tracking-wide">
              LOUND PREMIUM
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Elevate Your Recovery Reach
            </h2>
            <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Unlock unlimited priority postings, ad-free immersion, advanced radar radius filtering,
              and our prestigious verified LOUND VIP badge.
            </p>
          </div>

          {/* Current Status Banner if already subscribed */}
          {currentUser.isPremium && (
            <div className="p-3.5 bg-neutral-900 border border-white/20 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="text-white font-bold block">
                  Active Subscription: {currentUser.premiumTier?.toUpperCase()} PLAN
                </span>
                <span className="text-neutral-400 text-[11px]">
                  All premium privileges enabled · Renews automatically
                </span>
              </div>
              <button
                onClick={handleCancel}
                className="text-neutral-400 hover:text-red-400 text-xs underline font-medium"
              >
                Cancel Subscription
              </button>
            </div>
          )}

          {/* Pricing Tier Selector */}
          <div className="grid grid-cols-2 gap-3">
            {/* Annual Plan */}
            <div
              onClick={() => setSelectedPlan('annual')}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlan === 'annual'
                  ? 'border-white bg-white/5'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="absolute top-2 right-2 bg-white text-black text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                SAVE $5 / YR
              </div>
              <div className="text-xs font-semibold text-neutral-400 mb-1">ANNUAL PLAN</div>
              <div className="text-2xl font-black text-white font-mono">$55</div>
              <div className="text-[11px] text-neutral-400 mt-1">Billed annually ($4.58/mo)</div>
            </div>

            {/* Monthly Plan */}
            <div
              onClick={() => setSelectedPlan('monthly')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedPlan === 'monthly'
                  ? 'border-white bg-white/5'
                  : 'border-neutral-800 bg-neutral-900/40 hover:border-neutral-700'
              }`}
            >
              <div className="text-xs font-semibold text-neutral-400 mb-1">MONTHLY PLAN</div>
              <div className="text-2xl font-black text-white font-mono">$5</div>
              <div className="text-[11px] text-neutral-400 mt-1">Billed monthly, cancel anytime</div>
            </div>
          </div>

          {/* Feature Matrix Comparison */}
          <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-900 text-xs">
            <div className="p-3 bg-neutral-900/80 font-bold text-white flex justify-between">
              <span>Benefit Comparison</span>
              <span className="text-neutral-400 font-normal">Free vs Premium</span>
            </div>
            {[
              { label: 'Lost & Found Essential Search & Posts', free: 'Basic (3/day)', prem: 'Unlimited Priority' },
              { label: 'Advertising Experience', free: 'Sponsored alerts', prem: '100% Ad-Free' },
              { label: 'Finder Community & Reward Escrow', free: 'Included', prem: 'Priority Payouts' },
              { label: 'Interactive Radar Map Radius Filters', free: 'Standard', prem: 'Precision Hyperlocal' },
              { label: 'Direct Messaging & Identity Shield', free: 'Standard', prem: 'Unlimited Threads' },
              { label: 'Profile Distinction', free: 'Standard Member', prem: 'LOUND VIP Monochrome Badge' },
              { label: 'Post Views & Search Analytics', free: 'No', prem: 'Advanced Heatmaps' }
            ].map((f, i) => (
              <div key={i} className="p-3 flex items-center justify-between text-[11px]">
                <span className="text-neutral-300">{f.label}</span>
                <div className="flex items-center gap-4 font-medium">
                  <span className="text-neutral-500">{f.free}</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-white" /> {f.prem}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Safety & Open Access Guarantee Notice */}
          <div className="p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl flex items-start gap-2.5 text-[11px] text-neutral-400 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-white shrink-0 mt-0.5" />
            <span>
              <strong>Ethical Access Policy:</strong> Essential safety features, reporting scams, viewing missing
              animal warnings, and contacting someone regarding a found item will NEVER be locked behind a paywall.
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-900/50 text-xs text-red-400 rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-neutral-900 border border-white text-xs text-white rounded-xl text-center font-bold">
              ✓ {successMessage}
            </div>
          )}

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3.5 bg-white text-black font-extrabold text-xs tracking-wider uppercase rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {isProcessing
                  ? 'Connecting Payment Gateway...'
                  : `Activate ${selectedPlan.toUpperCase()} Plan (${
                      selectedPlan === 'monthly' ? '$5/mo' : '$55/yr'
                    })`}
              </span>
            </button>
            <p className="text-[10px] text-center text-neutral-500 mt-2">
              Instant activation · Secure 256-bit SSL encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
