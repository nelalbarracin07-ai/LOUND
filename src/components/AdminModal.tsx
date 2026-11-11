import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Users,
  AlertTriangle,
  DollarSign,
  FileText,
  Ban,
  CheckCircle,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { PlatformStats, Post, ReportItem, User } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  currentUser
}) => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users' | 'posts'>('overview');
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/overview');
      const data = await res.json();
      if (res.ok) {
        setStats(data.stats);
        setUsers(data.users || []);
        setReports(data.reports || []);
        setPosts(data.posts || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAdminData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleBan = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/ban`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok && data.user) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReportStatus = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (res.ok) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this suspicious listing?')) return;
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-white" />
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                LOUND COMMAND & INTEGRITY DASHBOARD
              </h2>
              <p className="text-[11px] text-neutral-400">
                Administrator Moderation, Scam Prevention & Escrow Surveillance
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-800 bg-neutral-950">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Fraud Reports</span>
            {reports.filter((r) => r.status === 'pending').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-black text-[9px] flex items-center justify-center font-bold">
                {reports.filter((r) => r.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'users' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'posts' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Listings Moderation ({posts.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Total Users</div>
                  <div className="text-2xl font-black text-white font-mono">{stats.totalUsers}</div>
                  <div className="text-[10px] text-neutral-400">
                    {stats.premiumSubscribers} VIP Members
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Active Listings</div>
                  <div className="text-2xl font-black text-white font-mono">{stats.totalPosts}</div>
                  <div className="text-[10px] text-neutral-400">
                    {stats.activeLostItems} Lost · {stats.activeFoundItems} Found
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Items Reunited</div>
                  <div className="text-2xl font-black text-white font-mono">{stats.totalReunited}</div>
                  <div className="text-[10px] text-neutral-400">Community confirmed</div>
                </div>

                <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-1">
                  <div className="text-[10px] uppercase font-bold text-neutral-400">Escrow Rewards Paid</div>
                  <div className="text-2xl font-black text-white font-mono">${stats.totalRewardsPaid}</div>
                  <div className="text-[10px] text-neutral-400">100% verified releases</div>
                </div>
              </div>

              {/* Integrity & Fraud Alerts Banner */}
              <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-white font-bold">
                  <AlertTriangle className="w-4 h-4 text-white" />
                  <span>Real-time Anti-Fraud Guard</span>
                </div>
                <p className="text-neutral-400 leading-relaxed text-[11px]">
                  All communications and reward claims are automatically scanned for keywords indicating
                  advance wire fraud, extortion, or non-public requests. Users flagged by multiple community
                  members are queued for review.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No active abuse or scam reports filed.
                </div>
              ) : (
                reports.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-black bg-white px-2 py-0.5 rounded">
                            {r.reportedType} REPORT
                          </span>
                          <span className="text-xs font-mono text-neutral-500">{r.id}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{r.targetTitle}</h4>
                        <div className="text-xs text-neutral-300 font-semibold mt-0.5">
                          Reason: {r.reason}
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                        {r.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800/80">
                      "{r.details}"
                    </p>

                    {r.status === 'pending' && (
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800 text-xs">
                        <button
                          onClick={() => handleUpdateReportStatus(r.id, 'dismissed')}
                          className="px-3 py-1.5 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg"
                        >
                          Dismiss False Flag
                        </button>
                        <button
                          onClick={() => handleUpdateReportStatus(r.id, 'resolved')}
                          className="px-3.5 py-1.5 bg-white text-black font-bold rounded-lg hover:bg-neutral-200"
                        >
                          Resolve & Sanction Account
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'users' && (
            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden">
              {users.map((u) => (
                <div key={u.id} className="p-3.5 flex items-center justify-between text-xs bg-neutral-900/40">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover border border-neutral-800"
                    />
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{u.name}</span>
                        <span className="text-neutral-500 font-normal">@{u.username}</span>
                        {u.isPremium && (
                          <span className="text-[9px] bg-white text-black px-1.5 rounded font-extrabold">
                            VIP
                          </span>
                        )}
                        {u.role === 'admin' && (
                          <span className="text-[9px] border border-neutral-700 text-neutral-300 px-1.5 rounded font-bold">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {u.location} · {u.rating} ★ ({u.ratingsCount} reviews) · {u.reunitedCount} Reunited
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBan(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        u.isBanned
                          ? 'bg-red-500 text-white'
                          : 'border border-neutral-700 text-neutral-400 hover:text-white hover:border-white'
                      }`}
                    >
                      {u.isBanned ? 'BANNED' : 'Suspend / Ban'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.photos[0]}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded-lg border border-neutral-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase font-bold text-neutral-400">
                        {p.type} · {p.category}
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      <div className="text-[11px] text-neutral-400">
                        By {p.authorName} · Reward: ${p.rewardAmount}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeletePost(p.id)}
                    className="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors shrink-0"
                    title="Remove Listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
