import React, { useState, useEffect } from 'react';
import {
  TopBar,
  BottomNav,
  NavTab
} from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { ExploreView } from './components/ExploreView';
import { SwapSection } from './components/SwapSection';
import { FinderHub } from './components/FinderHub';
import { ProfileView } from './components/ProfileView';
import { PostWizardModal } from './components/PostWizardModal';
import { MessagingDrawer } from './components/MessagingDrawer';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { PremiumModal } from './components/PremiumModal';
import { AdminModal } from './components/AdminModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CommentsModal } from './components/CommentsModal';
import { FinderReportModal } from './components/FinderReportModal';
import { ReportModal } from './components/ReportModal';
import { Post, User, Comment as CommentType, NotificationItem } from './types';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [isLoading, setIsLoading] = useState(true);

  // Unread badge counters
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(1);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(2);

  // Modals & Drawers
  const [isPostWizardOpen, setIsPostWizardOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [chatPostRef, setChatPostRef] = useState<Post | null>(null);

  const [isNotifsOpen, setIsNotifsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const [selectedPostForDetail, setSelectedPostForDetail] = useState<Post | null>(null);
  const [selectedPostForComments, setSelectedPostForComments] = useState<Post | null>(null);
  const [selectedPostForClaim, setSelectedPostForClaim] = useState<Post | null>(null);
  const [reportTarget, setReportTarget] = useState<{
    type: 'post' | 'user' | 'swap';
    id: string;
    title: string;
  } | null>(null);

  // Fetch initial user and posts
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [authRes, postsRes, convsRes, notifsRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch('/api/posts'),
        fetch('/api/conversations'),
        fetch('/api/notifications')
      ]);

      const authData = await authRes.json();
      const postsData = await postsRes.json();
      const convsData = await convsRes.json();
      const notifsData = await notifsRes.json();

      if (authData.user) setCurrentUser(authData.user);
      if (postsData.posts) setPosts(postsData.posts);

      if (convsData.conversations) {
        const unreadConvs = convsData.conversations.reduce(
          (acc: number, c: any) => acc + (c.unreadCount || 0),
          0
        );
        setUnreadMessagesCount(unreadConvs);
      }

      if (notifsData.notifications) {
        const unread = notifsData.notifications.filter((n: any) => !n.read).length;
        setUnreadNotifsCount(unread);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Handler: Like Post
  const handleLikePost = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: p.likesCount + (nextLiked ? 1 : -1)
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Save Post
  const handleSavePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextSaved = !p.isSaved;
          return {
            ...p,
            isSaved: nextSaved,
            savesCount: p.savesCount + (nextSaved ? 1 : -1)
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/posts/${postId}/save`, { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Comment Added
  const handleCommentAdded = (postId: string, newComment: CommentType) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p))
    );
  };

  // Handler: Post Created
  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentTab('home');
    if (currentUser && !currentUser.isPremium) {
      setCurrentUser({
        ...currentUser,
        dailyPostsRemaining: Math.max(0, currentUser.dailyPostsRemaining - 1),
        lostItemsCount: newPost.type === 'lost' ? currentUser.lostItemsCount + 1 : currentUser.lostItemsCount,
        foundItemsCount: newPost.type === 'found' ? currentUser.foundItemsCount + 1 : currentUser.foundItemsCount
      });
    }
  };

  // Handler: Switch User
  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/auth/switch-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrentUser(data.user);
        loadInitialData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handler: Open Direct Chat with user
  const handleOpenDirectChat = async (targetUserId: string, postRef?: Post) => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId,
          postId: postRef?.id
        })
      });
      const data = await res.json();
      if (res.ok && data.conversation) {
        setActiveConvId(data.conversation.id);
        setChatPostRef(postRef || null);
        setIsMessagesOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-sm font-bold tracking-widest uppercase">Initializing LOUND</span>
        <span className="text-xs text-neutral-500 mt-1">Lost. Found. Reunited.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      {/* Top Application Bar */}
      <TopBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        currentUser={currentUser}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotifsCount={unreadNotifsCount}
        onOpenMessages={() => setIsMessagesOpen(true)}
        onOpenNotifications={() => setIsNotifsOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content View Container (with bottom padding for fixed mobile nav bar) */}
      <main className="flex-1 pb-20 overflow-x-hidden">
        {currentTab === 'home' && (
          <HomeFeed
            posts={posts}
            currentUser={currentUser}
            onLikePost={handleLikePost}
            onSavePost={handleSavePost}
            onOpenComments={(post) => setSelectedPostForComments(post)}
            onContactOwner={(post) => handleOpenDirectChat(post.authorId, post)}
            onClaimReward={(post) => setSelectedPostForClaim(post)}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onReportPost={(post) =>
              setReportTarget({ type: 'post', id: post.id, title: post.title })
            }
          />
        )}

        {currentTab === 'explore' && (
          <ExploreView
            posts={posts}
            currentUser={currentUser}
            onSelectPost={(post) => setSelectedPostForDetail(post)}
            onContactOwner={(post) => handleOpenDirectChat(post.authorId, post)}
            onOpenReport={(post) =>
              setReportTarget({ type: 'post', id: post.id, title: post.title })
            }
          />
        )}

        {currentTab === 'swap' && (
          <SwapSection
            currentUser={currentUser}
            onOpenDirectChat={(targetUserId) => handleOpenDirectChat(targetUserId)}
          />
        )}

        {currentTab === 'finder_hub' && (
          <FinderHub
            currentUser={currentUser}
            onSelectPost={(post) => setSelectedPostForDetail(post)}
            onSubmitReport={(post) => setSelectedPostForClaim(post)}
            onOpenDirectChat={(targetUserId, postRef) =>
              handleOpenDirectChat(targetUserId, postRef)
            }
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            allPosts={posts}
            onOpenPremium={() => setIsPremiumOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
            onSelectPost={(post) => setSelectedPostForDetail(post)}
            onSwitchUser={handleSwitchUser}
            onUpdateProfile={(updated) =>
              setCurrentUser((prev) => (prev ? { ...prev, ...updated } : prev))
            }
          />
        )}
      </main>

      {/* 5-Button Bottom Ergonomic Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenPostWizard={() => setIsPostWizardOpen(true)}
      />

      {/* Publish Lost/Found Wizard Modal */}
      <PostWizardModal
        isOpen={isPostWizardOpen}
        onClose={() => setIsPostWizardOpen(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
        onOpenPremium={() => {
          setIsPostWizardOpen(false);
          setIsPremiumOpen(true);
        }}
      />

      {/* P2P Private Messaging Drawer */}
      <MessagingDrawer
        isOpen={isMessagesOpen}
        onClose={() => {
          setIsMessagesOpen(false);
          setActiveConvId(null);
          setChatPostRef(null);
        }}
        currentUser={currentUser}
        activeConversationId={activeConvId}
        initialPostRef={chatPostRef}
        onReportUser={(targetUser) =>
          setReportTarget({ type: 'user', id: targetUser.id, title: targetUser.name })
        }
      />

      {/* Real-time Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotifsOpen}
        onClose={() => {
          setIsNotifsOpen(false);
          setUnreadNotifsCount(0);
        }}
        currentUser={currentUser}
        onOpenItem={(notif: NotificationItem) => {
          if (notif.type === 'message') {
            setIsMessagesOpen(true);
          } else if (notif.relatedId) {
            const match = posts.find((p) => p.id === notif.relatedId);
            if (match) setSelectedPostForDetail(match);
          }
        }}
      />

      {/* LOUND Premium Subscription Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
        currentUser={currentUser}
        onSubscriptionUpdated={(updatedUser) => setCurrentUser(updatedUser)}
      />

      {/* Admin Moderation & Integrity Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        currentUser={currentUser}
      />

      {/* Post Detail Inspection Modal */}
      <PostDetailModal
        post={selectedPostForDetail}
        isOpen={Boolean(selectedPostForDetail)}
        onClose={() => setSelectedPostForDetail(null)}
        currentUser={currentUser}
        onLikePost={handleLikePost}
        onSavePost={handleSavePost}
        onOpenComments={(post) => setSelectedPostForComments(post)}
        onContactOwner={(post) => handleOpenDirectChat(post.authorId, post)}
        onClaimReward={(post) => setSelectedPostForClaim(post)}
        onReportPost={(post) =>
          setReportTarget({ type: 'post', id: post.id, title: post.title })
        }
      />

      {/* Sightings & Discussion Comments Modal */}
      <CommentsModal
        post={selectedPostForComments}
        isOpen={Boolean(selectedPostForComments)}
        onClose={() => setSelectedPostForComments(null)}
        currentUser={currentUser}
        onCommentAdded={handleCommentAdded}
      />

      {/* Finder Recovery Report Modal */}
      <FinderReportModal
        post={selectedPostForClaim}
        isOpen={Boolean(selectedPostForClaim)}
        onClose={() => setSelectedPostForClaim(null)}
        currentUser={currentUser}
        onClaimSubmitted={(claim) => {
          // Notify user
        }}
      />

      {/* Anti-Fraud & Scam Report Modal */}
      <ReportModal
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        target={reportTarget}
      />
    </div>
  );
}
