import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  showText?: boolean;
  alt?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  alt = 'ရွှေလက်ရာ',
  onClick,
}) => {
  const getDimensionClass = () => {
    if (typeof size === 'number') {
      return '';
    }
    switch (size) {
      case 'xs':
        return 'w-6 h-6';
      case 'sm':
        return 'w-9 h-9';
      case 'md':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-20 h-20';
      case '2xl':
        return 'w-24 h-24';
      default:
        return 'w-10 h-10';
    }
  };

  const style = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative inline-flex items-center justify-center shrink-0 select-none overflow-hidden rounded-2xl shadow-sm ${getDimensionClass()} ${className}`}
      title={alt}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full object-contain"
        xmlns="http://www.w3.org/2000/svg"
        aria-label={alt}
        role="img"
      >
        <defs>
          {/* Background Radial Vignette */}
          <radialGradient id="logoBgGrad" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="#232428" />
            <stop offset="65%" stopColor="#18191c" />
            <stop offset="100%" stopColor="#121315" />
          </radialGradient>

          {/* Outer Gold Ring Gradient */}
          <linearGradient id="logoGoldRing" x1="25%" y1="15%" x2="80%" y2="85%">
            <stop offset="0%" stopColor="#6e521e" />
            <stop offset="25%" stopColor="#c69537" />
            <stop offset="50%" stopColor="#fff6b3" />
            <stop offset="75%" stopColor="#dfa93c" />
            <stop offset="100%" stopColor="#73521b" />
          </linearGradient>

          {/* Star Gradient with Golden Highlights */}
          <linearGradient id="logoGoldStar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="12%" stopColor="#fff8d4" />
            <stop offset="40%" stopColor="#fed75b" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Central Sphere Gradient */}
          <radialGradient id="logoGoldSphere" cx="36%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fff176" />
            <stop offset="65%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#854d0e" />
          </radialGradient>

          {/* Burmese Typography Gradient */}
          <linearGradient id="logoGoldText" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fffbe0" />
            <stop offset="30%" stopColor="#ffde59" />
            <stop offset="75%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>

        {/* Squircle Rounded Dark Canvas Background */}
        <rect width="512" height="512" rx="108" fill="url(#logoBgGrad)" />

        {/* Outer Fine Gold Circle */}
        <circle cx="256" cy="256" r="226" fill="none" stroke="url(#logoGoldRing)" strokeWidth="3.5" opacity="0.9" />

        {/* Main 4-pointed Concave Star Emblem with Center Cutout */}
        <g>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M 256 108
               C 286 160 322 196 374 212
               C 322 228 286 264 256 320
               C 226 264 190 228 138 212
               C 190 196 226 160 256 108 Z
               M 256 165
               C 240 193 216 205 186 212
               C 216 219 240 231 256 258
               C 272 231 296 219 326 212
               C 296 205 272 193 256 165 Z"
            fill="url(#logoGoldStar)"
          />

          {/* Central Glowing Gold Sphere */}
          <circle cx="256" cy="212" r="18" fill="url(#logoGoldSphere)" />
        </g>

        {/* Burmese Brand Text: ရွှေလက်ရာ */}
        {showText && (
          <text
            x="256"
            y="422"
            textAnchor="middle"
            fontFamily="'Padauk', 'Noto Sans Myanmar', 'Pyidaungsu', 'Myanmar3', sans-serif"
            fontSize="46"
            fontWeight="bold"
            letterSpacing="1px"
            fill="url(#logoGoldText)"
          >
            ရွှေလက်ရာ
          </text>
        )}
      </svg>
    </div>
  );
};

export default Logo;
