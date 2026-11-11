import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, '.lound_store.json');

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Initial seed data with generated high-resolution assets
const SEED_DATA = {
  users: [
    {
      id: 'usr_me',
      username: 'nelalbarracin',
      name: 'Nel Albarracin',
      email: 'nelalbarracin07@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Lost-and-found investigator and community volunteer. Passionate about returning pets and essentials to their rightful homes.',
      location: 'Metro Manila, Philippines',
      rating: 4.96,
      ratingsCount: 28,
      verified: true,
      isPremium: true,
      premiumTier: 'annual',
      premiumExpiresAt: '2027-11-10T17:53:00.000Z',
      foundItemsCount: 14,
      lostItemsCount: 3,
      reunitedCount: 12,
      rewardsEarned: 750,
      role: 'admin',
      isBanned: false,
      dailyPostsRemaining: 999,
      createdAt: '2026-01-15T08:00:00.000Z',
    },
    {
      id: 'usr_marcus',
      username: 'marcus_v',
      name: 'Marcus Vance',
      email: 'marcus.v@example.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'BGC resident. Walking my dog daily and keeping an eye out for missing pets and lost items.',
      location: 'Bonifacio Global City, Taguig',
      rating: 4.88,
      ratingsCount: 16,
      verified: true,
      isPremium: false,
      premiumTier: null,
      foundItemsCount: 6,
      lostItemsCount: 1,
      reunitedCount: 5,
      rewardsEarned: 300,
      role: 'user',
      isBanned: false,
      dailyPostsRemaining: 3,
      createdAt: '2026-02-10T11:20:00.000Z',
    },
    {
      id: 'usr_elena',
      username: 'elena_rostova',
      name: 'Elena Rostova',
      email: 'elena.r@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      bio: 'Architect in Makati. Keen eye for lost accessories and gadgets.',
      location: 'Legazpi Village, Makati',
      rating: 4.92,
      ratingsCount: 9,
      verified: true,
      isPremium: true,
      premiumTier: 'monthly',
      foundItemsCount: 4,
      lostItemsCount: 2,
      reunitedCount: 3,
      rewardsEarned: 200,
      role: 'user',
      isBanned: false,
      dailyPostsRemaining: 999,
      createdAt: '2026-03-01T14:10:00.000Z',
    },
    {
      id: 'usr_kenji',
      username: 'kenji_s',
      name: 'Kenji Sato',
      email: 'kenji.sato@example.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      bio: 'Coffee enthusiast & cyclist. Exploring city streets every morning.',
      location: 'Salcedo Village, Makati',
      rating: 5.0,
      ratingsCount: 11,
      verified: true,
      isPremium: false,
      premiumTier: null,
      foundItemsCount: 7,
      lostItemsCount: 0,
      reunitedCount: 7,
      rewardsEarned: 450,
      role: 'user',
      isBanned: false,
      dailyPostsRemaining: 3,
      createdAt: '2026-04-12T09:30:00.000Z',
    }
  ],
  posts: [
    {
      id: 'post_1',
      title: 'Missing Golden Retriever: "Rusty" - Wearing Dark Leather Collar',
      type: 'lost',
      category: 'Pets & Animals',
      description: 'Rusty slipped his leash near Track 30th Park in BGC during an evening walk. He is a 3-year-old male Golden Retriever with friendly demeanor, wearing a black leather collar with brass hardware. Microchipped. Very food-motivated. Please do not chase him; kindly call or message immediately.',
      photos: [
        '/src/assets/images/lost_golden_retriever_1794362026611.jpg'
      ],
      dateLostOrFound: '2026-11-09',
      location: {
        country: 'Philippines',
        city: 'Taguig',
        barangay: 'Bonifacio Global City',
        specificAddress: 'Near Track 30th & 7th Avenue',
        lat: 14.5518,
        lng: 121.0505,
        isApproximate: true
      },
      rewardAmount: 300,
      rewardStatus: 'escrowed',
      status: 'lost',
      authorId: 'usr_marcus',
      authorName: 'Marcus Vance',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      authorRating: 4.88,
      isAuthorVerified: true,
      likesCount: 54,
      savesCount: 18,
      commentsCount: 9,
      sharesCount: 31,
      createdAt: '2026-11-09T18:40:00.000Z',
      isLiked: false,
      isSaved: true
    },
    {
      id: 'post_2',
      title: 'Lost Vintage Chronograph Watch (Aethel Automatic, Black Dial)',
      type: 'lost',
      category: 'Jewelry & Accessories',
      description: 'Lost my grandfather’s vintage automatic chronograph with black leather strap. I was sitting outdoor at a coffee shop on Tordesillas Street in Salcedo Village. Has immense sentimental value. Offering a $500 cash reward upon safe verification.',
      photos: [
        '/src/assets/images/lost_vintage_watch_1794362027334.jpg'
      ],
      dateLostOrFound: '2026-11-08',
      location: {
        country: 'Philippines',
        city: 'Makati',
        barangay: 'Salcedo Village',
        specificAddress: 'Tordesillas St corner Toledo',
        lat: 14.5612,
        lng: 121.0245,
        isApproximate: false
      },
      rewardAmount: 500,
      rewardStatus: 'escrowed',
      status: 'lost',
      authorId: 'usr_elena',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      authorRating: 4.92,
      isAuthorVerified: true,
      likesCount: 38,
      savesCount: 12,
      commentsCount: 4,
      sharesCount: 14,
      createdAt: '2026-11-08T15:15:00.000Z',
      isLiked: true,
      isSaved: false
    },
    {
      id: 'post_3',
      title: 'Found Weathered Leather Bifold Wallet with Brass Money Clip',
      type: 'found',
      category: 'Bags & Wallets',
      description: 'Found a black distressed leather wallet on the bench near Greenbelt 5 walkway. Contains cards under the initial "J.D.". Cash and cards are safe. To claim, owner must verify the full name on the ID card and describe internal receipts.',
      photos: [
        '/src/assets/images/found_leather_wallet_1794362026816.jpg'
      ],
      dateLostOrFound: '2026-11-10',
      location: {
        country: 'Philippines',
        city: 'Makati',
        barangay: 'San Lorenzo',
        specificAddress: 'Greenbelt 5 Garden Walkway',
        lat: 14.5529,
        lng: 121.0205,
        isApproximate: false
      },
      rewardAmount: 0,
      rewardStatus: 'none',
      status: 'found',
      authorId: 'usr_me',
      authorName: 'Nel Albarracin',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRating: 4.96,
      isAuthorVerified: true,
      likesCount: 22,
      savesCount: 8,
      commentsCount: 3,
      sharesCount: 6,
      createdAt: '2026-11-10T10:00:00.000Z',
      isLiked: false,
      isSaved: false
    },
    {
      id: 'post_4',
      title: 'Found Modern Metallic Keys with "Home Studio" Engraved Keyring',
      type: 'found',
      category: 'Keys',
      description: 'Three precision-cut door keys attached to a solid stainless steel tag engraved with "M 2023 HOME STUDIO". Found on a stone planter bench near Jaime Velasquez Park during Saturday morning walk.',
      photos: [
        '/src/assets/images/lost_keys_keychain_1794362027618.jpg'
      ],
      dateLostOrFound: '2026-11-09',
      location: {
        country: 'Philippines',
        city: 'Makati',
        barangay: 'Bel-Air',
        specificAddress: 'Jaime Velasquez Park Perimeter',
        lat: 14.5585,
        lng: 121.0267,
        isApproximate: false
      },
      rewardAmount: 50,
      rewardStatus: 'none',
      status: 'found',
      authorId: 'usr_kenji',
      authorName: 'Kenji Sato',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      authorRating: 5.0,
      isAuthorVerified: true,
      likesCount: 19,
      savesCount: 5,
      commentsCount: 2,
      sharesCount: 3,
      createdAt: '2026-11-09T08:30:00.000Z',
      isLiked: false,
      isSaved: false
    },
    {
      id: 'post_5',
      title: 'REUNITED: Siamese Cat "Mochi" Successfully Returned to Owner',
      type: 'found',
      category: 'Pets & Animals',
      description: 'Mochi was safely identified at a local vet clinic in Rockwell and reunited with her owner Sarah thanks to LOUND finder alerts! $150 reward was verified and paid out.',
      photos: [
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80'
      ],
      dateLostOrFound: '2026-11-06',
      location: {
        country: 'Philippines',
        city: 'Makati',
        barangay: 'Poblacion',
        specificAddress: 'Rockwell Center',
        lat: 14.5651,
        lng: 121.0366,
        isApproximate: true
      },
      rewardAmount: 150,
      rewardStatus: 'paid',
      status: 'reunited',
      authorId: 'usr_me',
      authorName: 'Nel Albarracin',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRating: 4.96,
      isAuthorVerified: true,
      likesCount: 96,
      savesCount: 42,
      commentsCount: 15,
      sharesCount: 68,
      createdAt: '2026-11-06T14:00:00.000Z',
      isLiked: true,
      isSaved: true
    }
  ],
  comments: [
    {
      id: 'cm_1',
      postId: 'post_1',
      userId: 'usr_kenji',
      userName: 'Kenji Sato',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      content: 'I saw a dog matching this description heading toward 9th Ave around 8 PM last night. Will check the CCTV with building security!',
      createdAt: '2026-11-09T20:15:00.000Z'
    },
    {
      id: 'cm_2',
      postId: 'post_1',
      userId: 'usr_me',
      userName: 'Nel Albarracin',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      content: 'Shared with local BGC pet community groups. Keeping eyes open during my run this evening.',
      createdAt: '2026-11-09T21:00:00.000Z'
    }
  ],
  swaps: [
    {
      id: 'swap_1',
      title: 'Keychron K2 Mechanical Keyboard (Wireless, Gateron Brown)',
      photos: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Like-new condition, aluminum frame, white backlight. Comes with original box and braided cable. Looking to trade for studio monitor headphones or wireless earbuds.',
      category: 'Phones & Electronics',
      desiredExchange: 'Sony WH-1000XM4 or Audio-Technica M50x headphones',
      condition: 'Like New',
      location: 'Makati City',
      authorId: 'usr_elena',
      authorName: 'Elena Rostova',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      authorRating: 4.92,
      status: 'available',
      proposalsCount: 2,
      createdAt: '2026-11-07T12:00:00.000Z'
    },
    {
      id: 'swap_2',
      title: 'Minimalist Matte Black Cycling Helmet (Medium 55-59cm)',
      photos: [
        'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'Used twice, wrong size for me. Clean, no drops or scratches. Seeking a compact handlebar bag or bike mini-pump with pressure gauge.',
      category: 'Vehicles & Transport',
      desiredExchange: 'Handlebar roll bag or Topeak mini pump',
      condition: 'Like New',
      location: 'Taguig (BGC)',
      authorId: 'usr_kenji',
      authorName: 'Kenji Sato',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      authorRating: 5.0,
      status: 'available',
      proposalsCount: 1,
      createdAt: '2026-11-08T16:30:00.000Z'
    }
  ],
  swapProposals: [
    {
      id: 'prop_1',
      swapId: 'swap_1',
      swapTitle: 'Keychron K2 Mechanical Keyboard',
      senderId: 'usr_me',
      senderName: 'Nel Albarracin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      offeredItemTitle: 'Audio-Technica ATH-M40x Studio Monitor Headphones',
      offeredItemDescription: 'Excellent condition with coiled cable and 3.5mm gold adapter. Clean ear cushions.',
      offeredItemPhotos: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
      ],
      message: 'Hi Elena! I have an ATH-M40x in pristine shape. Would love to swap for the Keychron K2.',
      status: 'pending',
      createdAt: '2026-11-09T14:20:00.000Z'
    }
  ],
  conversations: [
    {
      id: 'conv_1',
      participantIds: ['usr_me', 'usr_marcus'],
      participants: {
        usr_me: {
          name: 'Nel Albarracin',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          username: 'nelalbarracin'
        },
        usr_marcus: {
          name: 'Marcus Vance',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          username: 'marcus_v'
        }
      },
      lastMessage: 'Thank you Nel! I am heading over to 7th Ave right now to check.',
      lastMessageTime: '2026-11-10T11:45:00.000Z',
      unreadCount: 1,
      itemRef: {
        id: 'post_1',
        title: 'Missing Golden Retriever: "Rusty"',
        type: 'lost',
        image: '/src/assets/images/lost_golden_retriever_1794362026611.jpg'
      }
    }
  ],
  messages: [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_me',
      senderName: 'Nel Albarracin',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      text: 'Hi Marcus, saw your post for Rusty. I spoke with the security guard at 7th Avenue corner 28th street, he noted seeing a golden retriever resting near the fountain around 9 AM.',
      read: true,
      createdAt: '2026-11-10T11:30:00.000Z'
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'usr_marcus',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      text: 'Thank you Nel! I am heading over to 7th Ave right now to check.',
      read: false,
      createdAt: '2026-11-10T11:45:00.000Z'
    }
  ],
  rewardClaims: [
    {
      id: 'claim_1',
      postId: 'post_1',
      postTitle: 'Missing Golden Retriever: "Rusty"',
      ownerId: 'usr_marcus',
      finderId: 'usr_kenji',
      finderName: 'Kenji Sato',
      finderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      proofDescription: 'Found Rusty sheltered under the awning near Bonifacio High Street building 4. Matched the dark leather collar tag and gave him fresh water.',
      proofPhotoUrl: '/src/assets/images/lost_golden_retriever_1794362026611.jpg',
      recoveryLocation: 'Bonifacio High Street Bldg 4',
      rewardAmount: 300,
      status: 'pending',
      createdAt: '2026-11-10T16:00:00.000Z'
    }
  ],
  notifications: [
    {
      id: 'notif_1',
      userId: 'usr_me',
      type: 'message',
      title: 'New Message from Marcus Vance',
      body: 'Thank you Nel! I am heading over to 7th Ave right now to check.',
      relatedId: 'conv_1',
      read: false,
      createdAt: '2026-11-10T11:45:00.000Z'
    },
    {
      id: 'notif_2',
      userId: 'usr_me',
      type: 'recovery_confirmed',
      title: 'Recovery Reward Paid Out! +$150',
      body: 'Sarah confirmed safe recovery of "Mochi". $150 has been released to your balance.',
      relatedId: 'post_5',
      read: true,
      createdAt: '2026-11-06T15:00:00.000Z'
    },
    {
      id: 'notif_3',
      userId: 'usr_me',
      type: 'nearby_alert',
      title: 'Nearby Lost Item Alert',
      body: 'A vintage chronograph watch was reported lost within 1.5 km of your location in Makati.',
      relatedId: 'post_2',
      read: true,
      createdAt: '2026-11-08T15:20:00.000Z'
    }
  ],
  reports: [
    {
      id: 'rep_1',
      reporterId: 'usr_kenji',
      reportedType: 'user',
      targetId: 'usr_suspicious_99',
      targetTitle: 'Suspicious Profile: @quick_cash_recovery',
      reason: 'Advance Fee Scam Request',
      details: 'User demanded an upfront $50 "finder delivery fee" via wire transfer before showing any proof photos of the lost keys.',
      status: 'pending',
      createdAt: '2026-11-10T12:00:00.000Z'
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      userId: 'usr_me',
      type: 'subscription',
      amount: 55,
      status: 'success',
      description: 'LOUND Premium - 1 Year Membership ($55/yr)',
      createdAt: '2026-11-10T17:53:00.000Z'
    },
    {
      id: 'tx_2',
      userId: 'usr_me',
      type: 'reward_payout',
      amount: 150,
      status: 'success',
      description: 'Reward payout confirmed for returning Mochi',
      createdAt: '2026-11-06T15:00:00.000Z'
    }
  ]
};

// Persistent database store
export interface StoreData {
  users: any[];
  posts: any[];
  comments: any[];
  swaps: any[];
  swapProposals: any[];
  conversations: any[];
  messages: any[];
  rewardClaims: any[];
  notifications: any[];
  reports: any[];
  transactions: any[];
}

let store: StoreData = { ...SEED_DATA };

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      store = JSON.parse(raw);
    } else {
      saveStore();
    }
  } catch (err) {
    console.error('Error loading store, using seed data:', err);
    store = { ...SEED_DATA };
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

loadStore();

// Current session user helper (Defaults to Nel Albarracin)
let currentUserId = 'usr_me';

// ======================== API ROUTES ========================

// Current authenticated user
app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = store.users.find((u) => u.id === currentUserId) || store.users[0];
  res.json({ user });
});

// Update profile
app.put('/api/auth/profile', (req: Request, res: Response) => {
  const { name, bio, location, avatar } = req.body;
  const user = store.users.find((u) => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (avatar) user.avatar = avatar;
  saveStore();
  res.json({ user });
});

// Switch user for testing or logout/login
app.post('/api/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const found = store.users.find((u) => u.id === userId);
  if (found) {
    currentUserId = found.id;
    return res.json({ user: found });
  }
  res.status(404).json({ error: 'User not found' });
});

// GET Posts with search & filters
app.get('/api/posts', (req: Request, res: Response) => {
  let list = [...store.posts];
  const { type, category, status, search, minReward, city, authorId } = req.query;

  if (type && type !== 'all') {
    list = list.filter((p) => p.type === type);
  }
  if (category && category !== 'All') {
    list = list.filter((p) => p.category === category);
  }
  if (status && status !== 'all') {
    list = list.filter((p) => p.status === status);
  }
  if (authorId) {
    list = list.filter((p) => p.authorId === authorId);
  }
  if (city) {
    list = list.filter((p) =>
      p.location.city.toLowerCase().includes(String(city).toLowerCase()) ||
      p.location.barangay.toLowerCase().includes(String(city).toLowerCase())
    );
  }
  if (minReward && Number(minReward) > 0) {
    list = list.filter((p) => p.rewardAmount >= Number(minReward));
  }
  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.barangay.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ posts: list });
});

// Single post
app.get('/api/posts/:id', (req: Request, res: Response) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const comments = store.comments.filter((c) => c.postId === post.id);
  res.json({ post, comments });
});

// Create Post
app.post('/api/posts', (req: Request, res: Response) => {
  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];

  // Daily posting allowance enforcement for free accounts
  if (!currentUser.isPremium && currentUser.dailyPostsRemaining <= 0) {
    return res.status(403).json({
      error: 'Daily posting limit reached for free account. Upgrade to LOUND Premium for unlimited posts.'
    });
  }

  const {
    title,
    type,
    category,
    description,
    photos,
    dateLostOrFound,
    location,
    rewardAmount
  } = req.body;

  if (!title || !type || !category || !description) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const reward = Math.max(0, Number(rewardAmount) || 0);

  const newPost: any = {
    id: `post_${Date.now()}`,
    title,
    type,
    category,
    description,
    photos: photos && photos.length ? photos : ['/src/assets/images/lost_keys_keychain_1794362027618.jpg'],
    dateLostOrFound: dateLostOrFound || new Date().toISOString().split('T')[0],
    location: {
      country: location?.country || 'Philippines',
      city: location?.city || 'Metro Manila',
      barangay: location?.barangay || 'Central',
      specificAddress: location?.specificAddress || 'Public Area',
      lat: Number(location?.lat) || 14.5547,
      lng: Number(location?.lng) || 121.0244,
      isApproximate: Boolean(location?.isApproximate)
    },
    rewardAmount: reward,
    rewardStatus: reward > 0 ? 'escrowed' : 'none',
    status: type === 'lost' ? 'lost' : 'found',
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    authorRating: currentUser.rating,
    isAuthorVerified: currentUser.verified,
    likesCount: 0,
    savesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: new Date().toISOString(),
    isLiked: false,
    isSaved: false
  };

  store.posts.unshift(newPost);
  if (!currentUser.isPremium) {
    currentUser.dailyPostsRemaining = Math.max(0, currentUser.dailyPostsRemaining - 1);
  }
  if (type === 'lost') {
    currentUser.lostItemsCount += 1;
  } else {
    currentUser.foundItemsCount += 1;
  }

  // Push nearby alert notification to other users
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: 'usr_marcus',
    type: 'nearby_alert',
    title: `New ${type.toUpperCase()} Item: ${title}`,
    body: `Reported in ${newPost.location.city} (${newPost.location.barangay}). Check details!`,
    relatedId: newPost.id,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.status(201).json({ post: newPost });
});

// Like / Unlike post
app.post('/api/posts/:id/like', (req: Request, res: Response) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.isLiked = !post.isLiked;
  post.likesCount += post.isLiked ? 1 : -1;
  saveStore();
  res.json({ isLiked: post.isLiked, likesCount: post.likesCount });
});

// Save / Unsave post
app.post('/api/posts/:id/save', (req: Request, res: Response) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  post.isSaved = !post.isSaved;
  post.savesCount += post.isSaved ? 1 : -1;
  saveStore();
  res.json({ isSaved: post.isSaved, savesCount: post.savesCount });
});

// Add comment to post
app.post('/api/posts/:id/comment', (req: Request, res: Response) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Content required' });

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];

  const comment = {
    id: `cm_${Date.now()}`,
    postId: post.id,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  store.comments.push(comment);
  post.commentsCount += 1;

  // Notify post author if not self
  if (post.authorId !== currentUser.id) {
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: post.authorId,
      type: 'comment',
      title: `${currentUser.name} commented on your post`,
      body: content.trim().slice(0, 80),
      relatedId: post.id,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  saveStore();
  res.status(201).json({ comment, commentsCount: post.commentsCount });
});

// Delete Post
app.delete('/api/posts/:id', (req: Request, res: Response) => {
  const index = store.posts.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Post not found' });
  const currentUser = store.users.find((u) => u.id === currentUserId);
  if (store.posts[index].authorId !== currentUserId && currentUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized to delete this post' });
  }
  store.posts.splice(index, 1);
  saveStore();
  res.json({ success: true });
});

// Mark Post as Reunited / Closed
app.put('/api/posts/:id/status', (req: Request, res: Response) => {
  const post = store.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { status } = req.body;
  post.status = status;
  if (status === 'reunited') {
    const user = store.users.find((u) => u.id === post.authorId);
    if (user) user.reunitedCount += 1;
  }
  saveStore();
  res.json({ post });
});

// ======================== SWAP SYSTEM ========================

// GET Swaps
app.get('/api/swaps', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let list = [...store.swaps];
  if (category && category !== 'All') {
    list = list.filter((s) => s.category === category);
  }
  if (search && String(search).trim()) {
    const q = String(search).toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.desiredExchange.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }
  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ swaps: list });
});

// Create Swap
app.post('/api/swaps', (req: Request, res: Response) => {
  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];
  const { title, photos, description, category, desiredExchange, condition, location } = req.body;

  if (!title || !description || !desiredExchange) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const newSwap: any = {
    id: `swap_${Date.now()}`,
    title,
    photos: photos && photos.length ? photos : ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80'],
    description,
    category: category || 'Miscellaneous',
    desiredExchange,
    condition: condition || 'Like New',
    location: location || currentUser.location,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar,
    authorRating: currentUser.rating,
    status: 'available',
    proposalsCount: 0,
    createdAt: new Date().toISOString()
  };

  store.swaps.unshift(newSwap);
  saveStore();
  res.status(201).json({ swap: newSwap });
});

// Send Swap Proposal
app.post('/api/swaps/:id/proposals', (req: Request, res: Response) => {
  const swap = store.swaps.find((s) => s.id === req.params.id);
  if (!swap) return res.status(404).json({ error: 'Swap not found' });

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];
  const { offeredItemTitle, offeredItemDescription, offeredItemPhotos, message } = req.body;

  if (!offeredItemTitle || !message) {
    return res.status(400).json({ error: 'Item title and message required' });
  }

  const proposal = {
    id: `prop_${Date.now()}`,
    swapId: swap.id,
    swapTitle: swap.title,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    offeredItemTitle,
    offeredItemDescription: offeredItemDescription || '',
    offeredItemPhotos: offeredItemPhotos || [],
    message,
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  store.swapProposals.unshift(proposal);
  swap.proposalsCount += 1;

  // Send notification to swap owner
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: swap.authorId,
    type: 'swap_proposal',
    title: `New Swap Proposal for: ${swap.title}`,
    body: `${currentUser.name} offered "${offeredItemTitle}". Tap to review and negotiate.`,
    relatedId: swap.id,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.status(201).json({ proposal });
});

// Update Proposal status (accept, reject, complete)
app.put('/api/swap-proposals/:id', (req: Request, res: Response) => {
  const proposal = store.swapProposals.find((p) => p.id === req.params.id);
  if (!proposal) return res.status(404).json({ error: 'Proposal not found' });
  const { status } = req.body;
  proposal.status = status;

  const swap = store.swaps.find((s) => s.id === proposal.swapId);
  if (swap && status === 'accepted') {
    swap.status = 'proposed';
  } else if (swap && status === 'completed') {
    swap.status = 'completed';
  }

  // Notify sender
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: proposal.senderId,
    type: 'swap_status',
    title: `Swap Proposal ${status.toUpperCase()}`,
    body: `Your offer for "${proposal.swapTitle}" has been marked as ${status}.`,
    relatedId: proposal.swapId,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.json({ proposal });
});

// ======================== REWARDS & RECOVERY CLAIMS ========================

// GET Finder board / reward posts
app.get('/api/rewards/board', (req: Request, res: Response) => {
  const postsWithRewards = store.posts.filter((p) => p.rewardAmount > 0);
  postsWithRewards.sort((a, b) => b.rewardAmount - a.rewardAmount);
  res.json({
    posts: postsWithRewards,
    claims: store.rewardClaims
  });
});

// Submit found item report / claim reward
app.post('/api/rewards/claim', (req: Request, res: Response) => {
  const { postId, proofDescription, proofPhotoUrl, recoveryLocation } = req.body;
  const post = store.posts.find((p) => p.id === postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];

  const claim: any = {
    id: `claim_${Date.now()}`,
    postId: post.id,
    postTitle: post.title,
    ownerId: post.authorId,
    finderId: currentUser.id,
    finderName: currentUser.name,
    finderAvatar: currentUser.avatar,
    proofDescription,
    proofPhotoUrl: proofPhotoUrl || post.photos[0],
    recoveryLocation: recoveryLocation || 'Specified safe handover point',
    rewardAmount: post.rewardAmount,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  store.rewardClaims.unshift(claim);

  // Notify owner
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: post.authorId,
    type: 'reward_update',
    title: `Found Item Report Filed for "${post.title}"`,
    body: `${currentUser.name} submitted recovery proof for your $${post.rewardAmount} reward. Tap to review.`,
    relatedId: claim.id,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.status(201).json({ claim });
});

// Owner confirms recovery & releases reward
app.post('/api/rewards/claims/:id/confirm', (req: Request, res: Response) => {
  const claim = store.rewardClaims.find((c) => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'Claim not found' });

  claim.status = 'confirmed_by_owner';

  // Mark post as reunited
  const post = store.posts.find((p) => p.id === claim.postId);
  if (post) {
    post.status = 'reunited';
    post.rewardStatus = 'paid';
  }

  // Credit finder
  const finder = store.users.find((u) => u.id === claim.finderId);
  if (finder) {
    finder.rewardsEarned += claim.rewardAmount;
    finder.reunitedCount += 1;
    finder.rating = Math.min(5.0, Number((finder.rating + 0.05).toFixed(2)));
    finder.ratingsCount += 1;
  }

  // Owner stats
  const owner = store.users.find((u) => u.id === claim.ownerId);
  if (owner) {
    owner.reunitedCount += 1;
  }

  // Record transaction
  store.transactions.unshift({
    id: `tx_${Date.now()}`,
    userId: claim.finderId,
    type: 'reward_payout',
    amount: claim.rewardAmount,
    status: 'success',
    description: `Reward payout for returning "${claim.postTitle}"`,
    createdAt: new Date().toISOString()
  });

  // Notify finder
  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: claim.finderId,
    type: 'recovery_confirmed',
    title: `Reward Confirmed & Released! +$${claim.rewardAmount}`,
    body: `The owner confirmed recovery of "${claim.postTitle}". Your reward of $${claim.rewardAmount} has been credited.`,
    relatedId: claim.postId,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.json({ claim, post });
});

// ======================== MESSAGING ========================

// GET Conversations for current user
app.get('/api/conversations', (req: Request, res: Response) => {
  const userConvs = store.conversations.filter((c) => c.participantIds.includes(currentUserId));
  res.json({ conversations: userConvs });
});

// GET or Create conversation with user
app.post('/api/conversations', (req: Request, res: Response) => {
  const { targetUserId, postId } = req.body;
  if (!targetUserId) return res.status(400).json({ error: 'Target user required' });

  let conv = store.conversations.find(
    (c) => c.participantIds.includes(currentUserId) && c.participantIds.includes(targetUserId)
  );

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];
  const targetUser = store.users.find((u) => u.id === targetUserId);
  if (!targetUser) return res.status(404).json({ error: 'User not found' });

  const post = postId ? store.posts.find((p) => p.id === postId) : null;

  if (!conv) {
    conv = {
      id: `conv_${Date.now()}`,
      participantIds: [currentUserId, targetUserId],
      participants: {
        [currentUser.id]: {
          name: currentUser.name,
          avatar: currentUser.avatar,
          username: currentUser.username
        },
        [targetUser.id]: {
          name: targetUser.name,
          avatar: targetUser.avatar,
          username: targetUser.username
        }
      },
      lastMessage: 'Conversation started',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      itemRef: post
        ? {
            id: post.id,
            title: post.title,
            type: post.type,
            image: post.photos[0]
          }
        : undefined
    };
    store.conversations.unshift(conv);
    saveStore();
  }

  res.json({ conversation: conv });
});

// GET Messages in conversation
app.get('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const messages = store.messages.filter((m) => m.conversationId === req.params.id);
  // mark unread as read
  messages.forEach((m) => {
    if (m.senderId !== currentUserId) m.read = true;
  });
  saveStore();
  res.json({ messages });
});

// Send Message
app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { text, photoUrl, itemRef } = req.body;
  const conv = store.conversations.find((c) => c.id === req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];

  const msg = {
    id: `msg_${Date.now()}`,
    conversationId: conv.id,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    text: text || '',
    photoUrl: photoUrl || undefined,
    itemRef: itemRef || undefined,
    read: false,
    createdAt: new Date().toISOString()
  };

  store.messages.push(msg);
  conv.lastMessage = text || (photoUrl ? '📷 [Photo attachment]' : 'Message');
  conv.lastMessageTime = new Date().toISOString();

  // Notify other participant
  const otherId = conv.participantIds.find((id: string) => id !== currentUser.id);
  if (otherId) {
    store.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: otherId,
      type: 'message',
      title: `Message from ${currentUser.name}`,
      body: (text || 'Sent an attachment').slice(0, 60),
      relatedId: conv.id,
      read: false,
      createdAt: new Date().toISOString()
    });
  }

  saveStore();
  res.status(201).json({ message: msg });
});

// ======================== LOUND PREMIUM SUBSCRIPTION ========================

// Upgrade / Subscribe
app.post('/api/subscription/checkout', (req: Request, res: Response) => {
  const { tier } = req.body; // 'monthly' ($5) or 'annual' ($55)
  if (!tier || !['monthly', 'annual'].includes(tier)) {
    return res.status(400).json({ error: 'Valid tier required (monthly or annual)' });
  }

  const user = store.users.find((u) => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const amount = tier === 'monthly' ? 5 : 55;
  const expires = new Date();
  if (tier === 'monthly') {
    expires.setMonth(expires.getMonth() + 1);
  } else {
    expires.setFullYear(expires.getFullYear() + 1);
  }

  user.isPremium = true;
  user.premiumTier = tier;
  user.premiumExpiresAt = expires.toISOString();
  user.dailyPostsRemaining = 9999;

  store.transactions.unshift({
    id: `tx_${Date.now()}`,
    userId: user.id,
    type: 'subscription',
    amount,
    status: 'success',
    description: `LOUND Premium (${tier === 'monthly' ? '$5/month' : '$55/year (Saved $5)'})`,
    createdAt: new Date().toISOString()
  });

  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: user.id,
    type: 'subscription',
    title: 'Welcome to LOUND Premium!',
    body: `Your ${tier} subscription is now active with ad-free experience, unlimited posts, and VIP badge.`,
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.json({
    success: true,
    user,
    message: `Subscribed successfully to ${tier} plan.`
  });
});

// Cancel subscription
app.post('/api/subscription/cancel', (req: Request, res: Response) => {
  const user = store.users.find((u) => u.id === currentUserId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isPremium = false;
  user.premiumTier = null;
  user.dailyPostsRemaining = 3;

  store.notifications.unshift({
    id: `notif_${Date.now()}`,
    userId: user.id,
    type: 'subscription',
    title: 'LOUND Premium Cancelled',
    body: 'Your subscription has ended. You have been switched to standard free membership.',
    read: false,
    createdAt: new Date().toISOString()
  });

  saveStore();
  res.json({ success: true, user });
});

// ======================== NOTIFICATIONS ========================

app.get('/api/notifications', (req: Request, res: Response) => {
  const userNotifs = store.notifications.filter((n) => n.userId === currentUserId);
  res.json({ notifications: userNotifs });
});

app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = store.notifications.find((n) => n.id === req.params.id);
  if (notif) notif.read = true;
  saveStore();
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  store.notifications.forEach((n) => {
    if (n.userId === currentUserId) n.read = true;
  });
  saveStore();
  res.json({ success: true });
});

// ======================== REPORTING & ANTI-FRAUD ========================

app.post('/api/reports', (req: Request, res: Response) => {
  const { reportedType, targetId, targetTitle, reason, details } = req.body;
  if (!reportedType || !targetId || !reason) {
    return res.status(400).json({ error: 'Required report fields missing' });
  }

  const currentUser = store.users.find((u) => u.id === currentUserId) || store.users[0];

  const report: any = {
    id: `rep_${Date.now()}`,
    reporterId: currentUser.id,
    reportedType,
    targetId,
    targetTitle: targetTitle || 'Target Item',
    reason,
    details: details || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  store.reports.unshift(report);
  saveStore();
  res.status(201).json({ report });
});

// ======================== ADMIN DASHBOARD ========================

app.get('/api/admin/overview', (req: Request, res: Response) => {
  const currentUser = store.users.find((u) => u.id === currentUserId);
  if (currentUser?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const activeLost = store.posts.filter((p) => p.status === 'lost').length;
  const activeFound = store.posts.filter((p) => p.status === 'found').length;
  const reunited = store.posts.filter((p) => p.status === 'reunited').length;
  const totalRewards = store.transactions
    .filter((t) => t.type === 'reward_payout')
    .reduce((acc, t) => acc + t.amount, 0);
  const premiumCount = store.users.filter((u) => u.isPremium).length;

  res.json({
    stats: {
      totalUsers: store.users.length,
      totalPosts: store.posts.length,
      activeLostItems: activeLost,
      activeFoundItems: activeFound,
      totalReunited: reunited,
      totalRewardsPaid: totalRewards,
      activeSwaps: store.swaps.length,
      pendingReports: store.reports.filter((r) => r.status === 'pending').length,
      premiumSubscribers: premiumCount
    },
    users: store.users,
    reports: store.reports,
    posts: store.posts,
    transactions: store.transactions
  });
});

app.put('/api/admin/users/:id/ban', (req: Request, res: Response) => {
  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isBanned = !user.isBanned;
  saveStore();
  res.json({ user });
});

app.put('/api/admin/reports/:id', (req: Request, res: Response) => {
  const report = store.reports.find((r) => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  const { status } = req.body;
  report.status = status;
  saveStore();
  res.json({ report });
});

// ======================== VITE INTEGRATION ========================

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LOUND full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
