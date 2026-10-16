import React from 'react';
import { IndianCricketer } from '../data/cricketers';

interface PlayerAvatarProps {
  player: IndianCricketer;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showJerseyNumber?: boolean;
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = 'md',
  showJerseyNumber = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-14 h-14 text-sm',
    lg: 'w-20 h-20 text-base',
    xl: 'w-32 h-32 text-lg',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  };

  // Distinct facial styling profiles per cricketer
  const hasHeavyBeard = ['virat-kohli', 'rohit-sharma', 'ravindra-jadeja', 'kl-rahul', 'mohammed-shami'].includes(player.id);
  const hasGoatee = ['hardik-pandya', 'suryakumar-yadav'].includes(player.id);
  const isClassicClean = ['sachin-tendulkar', 'shubman-gill'].includes(player.id);
  const hasSaltPepper = player.id === 'ms-dhoni';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm border border-slate-700/60 bg-gradient-to-b from-slate-800 to-slate-900 ${sizeMap[size]} ${className}`}
      title={player.name}
    >
      {/* SVG Stylized Biometric Player Silhouette */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`grad-${player.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id={`jersey-${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>

        <rect width="100" height="100" fill={`url(#grad-${player.id})`} />

        {/* Indian Cricket Jersey Collar */}
        <path
          d="M15,95 Q50,75 85,95 L95,100 L5,100 Z"
          fill={`url(#jersey-${player.id})`}
        />
        {/* Tricolor India Trim */}
        <path d="M42,86 L50,92 L58,86" stroke="#f97316" strokeWidth="2" fill="none" />
        <path d="M43,89 L50,95 L57,89" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <path d="M44,92 L50,98 L56,92" stroke="#16a34a" strokeWidth="1.5" fill="none" />

        {/* Neck */}
        <rect x="42" y="60" width="16" height="22" rx="4" fill="#d49b73" />

        {/* Head Contour */}
        <ellipse cx="50" cy="46" rx="22" ry="26" fill="#e2a77e" />

        {/* Hair and Cut */}
        {player.id === 'sachin-tendulkar' ? (
          // Iconic curly hair
          <path
            d="M26,38 Q32,16 50,16 Q68,16 74,38 Q76,46 72,50 Q66,22 50,22 Q34,22 28,50 Z"
            fill="#1c1917"
          />
        ) : (
          // Modern athletic taper fade
          <path
            d="M27,42 Q30,18 50,18 Q70,18 73,42 Q75,30 50,24 Q25,30 27,42 Z"
            fill="#09090b"
          />
        )}

        {/* Ears */}
        <ellipse cx="27" cy="48" rx="4" ry="7" fill="#d49b73" />
        <ellipse cx="73" cy="48" rx="4" ry="7" fill="#d49b73" />

        {/* Eyebrows */}
        <path d="M34,39 Q40,36 45,38" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M55,38 Q60,36 66,39" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Eyes with focus */}
        <ellipse cx="40" cy="43" rx="3.5" ry="2" fill="#18181b" />
        <circle cx="40" cy="43" r="1.2" fill="#ffffff" />
        <ellipse cx="60" cy="43" rx="3.5" ry="2" fill="#18181b" />
        <circle cx="60" cy="43" r="1.2" fill="#ffffff" />

        {/* Nose bridge & tip */}
        <path d="M50,42 L48,53 L53,53" stroke="#b47b54" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Mouth / Smile */}
        <path d="M43,62 Q50,66 57,62" stroke="#9a3412" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Facial Hair Types */}
        {hasHeavyBeard && (
          <path
            d="M32,50 Q36,72 50,73 Q64,72 68,50 Q64,68 50,69 Q36,68 32,50 Z"
            fill="#1c1917"
            opacity="0.88"
          />
        )}
        {hasHeavyBeard && (
          <path d="M41,58 Q50,56 59,58" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {hasGoatee && (
          <path
            d="M44,66 Q50,73 56,66 Q50,71 44,66 Z"
            fill="#18181b"
          />
        )}

        {hasSaltPepper && (
          <path
            d="M32,54 Q38,71 50,72 Q62,71 68,54 Q62,67 50,68 Q38,67 32,54 Z"
            fill="#52525b"
            opacity="0.75"
          />
        )}

        {isClassicClean && (
          <circle cx="50" cy="67" r="1.5" fill="#c28860" />
        )}
      </svg>

      {/* Jersey Number Tag */}
      {showJerseyNumber && (
        <span
          className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-blue-600/90 text-white font-mono text-[10px] font-bold tabular-nums shadow-sm"
          title={`Jersey #${player.jerseyNumber}`}
        >
          #{player.jerseyNumber}
        </span>
      )}
    </div>
  );
};
