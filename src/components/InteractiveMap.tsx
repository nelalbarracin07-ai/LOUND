import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';
import { Post } from '../types';

interface InteractiveMapProps {
  posts: Post[];
  selectedPost: Post | null;
  onSelectPost: (post: Post) => void;
  userLocation?: { lat: number; lng: number; name: string };
  isSelectingPin?: boolean;
  onPinSelected?: (lat: number, lng: number, address: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  posts,
  selectedPost,
  onSelectPost,
  userLocation = { lat: 14.5547, lng: 121.0244, name: 'Makati & BGC Area' },
  isSelectingPin = false,
  onPinSelected
}) => {
  // Center coordinates representation on a normalized 1000x600 SVG canvas
  const centerLat = 14.5547;
  const centerLng = 121.0350;
  const scale = 8000; // coordinate to pixel scale

  const [activePinCoords, setActivePinCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Convert lat/lng to SVG x,y coordinates
  const project = (lat: number, lng: number) => {
    const x = 500 + (lng - centerLng) * scale;
    const y = 300 - (lat - centerLat) * scale;
    return { x: Math.max(40, Math.min(960, x)), y: Math.max(40, Math.min(560, y)) };
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isSelectingPin || !onPinSelected) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
    const clickY = ((e.clientY - rect.top) / rect.height) * 600;

    const clickedLng = Number((centerLng + (clickX - 500) / scale).toFixed(5));
    const clickedLat = Number((centerLat - (clickY - 300) / scale).toFixed(5));

    setActivePinCoords({ lat: clickedLat, lng: clickedLng });
    onPinSelected(clickedLat, clickedLng, `Coordinates (${clickedLat}, ${clickedLng})`);
  };

  return (
    <div className="relative w-full h-80 md:h-96 bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden select-none">
      {/* Background Grid Pattern & Map stylized topography */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full cursor-crosshair"
        onClick={handleMapClick}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#222222" strokeWidth="0.8" />
            <circle cx="20" cy="20" r="1" fill="#333333" />
          </pattern>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#262626" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Map Background grid */}
        <rect width="1000" height="600" fill="#0d0d0d" />
        <rect width="1000" height="600" fill="url(#grid)" />
        <circle cx="500" cy="300" r="380" fill="url(#centerGlow)" />

        {/* Stylized Metropolitan Road Arteries */}
        <path
          d="M 50 200 Q 300 240 500 290 T 950 360"
          fill="none"
          stroke="#262626"
          strokeWidth="6"
        />
        <path
          d="M 220 50 Q 350 280 480 550"
          fill="none"
          stroke="#262626"
          strokeWidth="4"
        />
        <path
          d="M 680 50 Q 600 300 750 550"
          fill="none"
          stroke="#262626"
          strokeWidth="3.5"
        />
        <path
          d="M 120 450 L 880 180"
          fill="none"
          stroke="#1f1f1f"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Sector Labels */}
        <text x="320" y="240" fill="#525252" fontSize="13" fontWeight="600" letterSpacing="1">
          MAKATI CBD
        </text>
        <text x="640" y="320" fill="#525252" fontSize="13" fontWeight="600" letterSpacing="1">
          BONIFACIO GLOBAL CITY (BGC)
        </text>
        <text x="440" y="470" fill="#404040" fontSize="11" letterSpacing="0.8">
          SAN LORENZO
        </text>
        <text x="360" y="140" fill="#404040" fontSize="11" letterSpacing="0.8">
          SALCEDO & BEL-AIR
        </text>

        {/* User approximate location radar pulse */}
        <g>
          <circle cx="500" cy="300" r="48" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 3" />
          <circle cx="500" cy="300" r="6" fill="#ffffff" />
          <circle cx="500" cy="300" r="14" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="r" values="6;28;6" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Post Pins */}
        {!isSelectingPin &&
          posts.map((post) => {
            const pos = project(post.location.lat, post.location.lng);
            const isSelected = selectedPost?.id === post.id;
            const isLost = post.type === 'lost';
            const isReunited = post.status === 'reunited';

            return (
              <g
                key={post.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPost(post);
                }}
              >
                {/* Approximate location safety perimeter circle if approximate */}
                {post.location.isApproximate && (
                  <circle
                    r="32"
                    fill="none"
                    stroke={isSelected ? '#ffffff' : '#525252'}
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.5"
                  />
                )}

                {/* Pin Head */}
                <circle
                  r={isSelected ? '14' : '10'}
                  fill={isReunited ? '#ffffff' : isLost ? '#000000' : '#ffffff'}
                  stroke={isLost ? '#ffffff' : '#000000'}
                  strokeWidth="2.5"
                />

                {/* Inner Symbol */}
                <text
                  x="0"
                  y="3.5"
                  textAnchor="middle"
                  fontSize={isSelected ? '10' : '8'}
                  fontWeight="bold"
                  fill={isLost ? '#ffffff' : '#000000'}
                >
                  {isReunited ? '✓' : isLost ? '!' : '●'}
                </text>

                {/* Reward pill tag if has reward */}
                {post.rewardAmount > 0 && (
                  <g transform="translate(0, -18)">
                    <rect
                      x="-22"
                      y="-12"
                      width="44"
                      height="16"
                      rx="3"
                      fill="#ffffff"
                    />
                    <text
                      x="0"
                      y="-1"
                      textAnchor="middle"
                      fill="#000000"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      ${post.rewardAmount}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

        {/* Selected or user-placed Pin in post-creator mode */}
        {isSelectingPin && activePinCoords && (
          <g
            transform={`translate(${project(activePinCoords.lat, activePinCoords.lng).x}, ${
              project(activePinCoords.lat, activePinCoords.lng).y
            })`}
          >
            <circle r="18" fill="none" stroke="#ffffff" strokeWidth="2" strokeDasharray="3 3" />
            <circle r="8" fill="#ffffff" />
            <text x="0" y="-14" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">
              NEW PIN
            </text>
          </g>
        )}
      </svg>

      {/* Map Control HUD Overlay */}
      <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
        <Navigation className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-white font-medium">{userLocation.name}</span>
        <span className="text-neutral-500">· Radar Active</span>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-2">
        <div className="bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] text-neutral-300">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
          <span>Privacy Shield: Vulnerable coordinates generalized</span>
        </div>
      </div>

      {/* Pin Selection Helper Banner */}
      {isSelectingPin && (
        <div className="absolute bottom-3 left-3 right-3 bg-black/90 border border-white/20 rounded-xl px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-4 h-4 text-white" />
            <span>Tap anywhere on the radar map to place the location pin</span>
          </div>
          {activePinCoords && (
            <span className="text-neutral-400 font-mono">
              {activePinCoords.lat}, {activePinCoords.lng}
            </span>
          )}
        </div>
      )}

      {/* Selected Post Floating Preview Card */}
      {!isSelectingPin && selectedPost && (
        <div className="absolute bottom-3 left-3 right-3 bg-neutral-900/95 backdrop-blur-md border border-neutral-700 rounded-xl p-3 flex items-center gap-3">
          <img
            src={selectedPost.photos[0]}
            alt={selectedPost.title}
            className="w-14 h-14 object-cover rounded-lg border border-neutral-800 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="uppercase tracking-wider font-semibold text-white">
                {selectedPost.type}
              </span>
              <span>·</span>
              <span>{selectedPost.location.barangay}, {selectedPost.location.city}</span>
            </div>
            <h4 className="text-sm font-semibold text-white truncate">{selectedPost.title}</h4>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              {selectedPost.rewardAmount > 0 ? (
                <span className="text-white font-bold bg-neutral-800 px-1.5 py-0.5 rounded">
                  ${selectedPost.rewardAmount} Reward
                </span>
              ) : (
                <span className="text-neutral-400">Standard Recovery</span>
              )}
              {selectedPost.location.isApproximate && (
                <span className="text-neutral-500 text-[10px]">Approx. perimeter</span>
              )}
            </div>
          </div>
          <button
            onClick={() => onSelectPost(selectedPost)}
            className="px-3 py-1.5 bg-white text-black font-semibold text-xs rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
};
