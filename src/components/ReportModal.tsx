import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: {
    type: 'post' | 'user' | 'swap';
    id: string;
    title: string;
  } | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  target
}) => {
  const [reason, setReason] = useState('Advance Fee or Wire Transfer Request');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportedType: target.type,
          targetId: target.id,
          targetTitle: target.title,
          reason,
          details: details.trim()
        })
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setDetails('');
          onClose();
        }, 1800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              File Scam or Fraud Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-white mx-auto" />
            <h4 className="text-base font-bold text-white">Report Transmitted to Security Team</h4>
            <p className="text-xs text-neutral-400">
              Thank you for keeping LOUND safe. Our integrity administrators will investigate this report promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-xs">
              <span className="text-[10px] text-neutral-500 uppercase block">Reported Object:</span>
              <strong className="text-white text-xs">{target.title}</strong>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Category of Violation
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-white"
              >
                <option value="Advance Fee or Wire Transfer Request">Advance Fee or Wire Transfer Request</option>
                <option value="Fake Listing / Stock Photo Fraud">Fake Listing / Stock Photo Fraud</option>
                <option value="Extortion or Hostage Animal Claim">Extortion or Hostage Animal Claim</option>
                <option value="Harassment or Inappropriate Contact">Harassment or Inappropriate Contact</option>
                <option value="Spam or Unrelated Commercial Sale">Spam or Unrelated Commercial Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Specific Details & Evidence
              </label>
              <textarea
                required
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Explain what occurred, quotes from chat, or why this item is suspicious..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !details.trim()}
                className="px-5 py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 disabled:opacity-40 transition-colors"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
