export type PostType = 'lost' | 'found';

export type ItemCategory =
  | 'Phones & Electronics'
  | 'Bags & Wallets'
  | 'Jewelry & Accessories'
  | 'Clothing'
  | 'Documents & ID'
  | 'Keys'
  | 'Vehicles & Transport'
  | 'Pets & Animals'
  | 'Miscellaneous';

export type PostStatus = 'lost' | 'found' | 'reunited' | 'closed';

export type RewardStatus = 'none' | 'pending' | 'escrowed' | 'paid' | 'cancelled';

export interface LocationData {
  country: string;
  city: string;
  barangay: string;
  specificAddress: string;
  lat: number;
  lng: number;
  isApproximate: boolean;
}

export interface Post {
  id: string;
  title: string;
  type: PostType;
  category: ItemCategory;
  description: string;
  photos: string[];
  dateLostOrFound: string;
  location: LocationData;
  rewardAmount: number;
  rewardStatus: RewardStatus;
  status: PostStatus;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRating: number;
  isAuthorVerified: boolean;
  likesCount: number;
  savesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  rating: number;
  ratingsCount: number;
  verified: boolean;
  isPremium: boolean;
  premiumTier: 'monthly' | 'annual' | null;
  premiumExpiresAt?: string;
  foundItemsCount: number;
  lostItemsCount: number;
  reunitedCount: number;
  rewardsEarned: number;
  role: 'user' | 'admin';
  isBanned: boolean;
  dailyPostsRemaining: number;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  photoUrl?: string;
  itemRef?: {
    id: string;
    title: string;
    type: PostType;
    image: string;
    rewardAmount?: number;
  };
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  participants: Record<string, { name: string; avatar: string; username: string }>;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  itemRef?: {
    id: string;
    title: string;
    type: PostType;
    image: string;
  };
}

export interface SwapListing {
  id: string;
  title: string;
  photos: string[];
  description: string;
  category: ItemCategory;
  desiredExchange: string;
  condition: 'Brand New' | 'Like New' | 'Gently Used' | 'Vintage / Fair';
  location: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRating: number;
  status: 'available' | 'proposed' | 'completed';
  proposalsCount: number;
  createdAt: string;
}

export interface SwapProposal {
  id: string;
  swapId: string;
  swapTitle: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  offeredItemTitle: string;
  offeredItemDescription: string;
  offeredItemPhotos: string[];
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: string;
}

export interface RewardClaim {
  id: string;
  postId: string;
  postTitle: string;
  ownerId: string;
  finderId: string;
  finderName: string;
  finderAvatar: string;
  proofDescription: string;
  proofPhotoUrl?: string;
  recoveryLocation: string;
  rewardAmount: number;
  status: 'pending' | 'confirmed_by_owner' | 'paid' | 'rejected';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'message' | 'comment' | 'like' | 'swap_proposal' | 'swap_status' | 'reward_update' | 'recovery_confirmed' | 'nearby_alert' | 'subscription';
  title: string;
  body: string;
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reportedType: 'post' | 'user' | 'swap' | 'claim';
  targetId: string;
  targetTitle: string;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalPosts: number;
  activeLostItems: number;
  activeFoundItems: number;
  totalReunited: number;
  totalRewardsPaid: number;
  activeSwaps: number;
  pendingReports: number;
  premiumSubscribers: number;
}
