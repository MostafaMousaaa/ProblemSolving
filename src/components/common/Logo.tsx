import React from 'react';

interface LogoProps {
  variant?: 'full' | 'icon' | 'image';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  onClick
}) => {
  // Dimension scales
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  const textSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  // If user requests explicit image asset from uploaded brand file
  if (variant === 'image') {
    return (
      <div 
        className={`inline-flex items-center cursor-pointer select-none ${className}`}
        onClick={onClick}
      >
        <img 
          src={`${import.meta.env.BASE_URL}assets/aistudio/HarryUP_7ba66f9e.jpg`}
          alt="HarryUp Official Brand Logo" 
          className={`${sizeClasses[size]} object-contain rounded-lg shadow-xs hover:opacity-95 transition-opacity`}
        />
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-xl bg-[#0b1a30] text-white shadow-md p-1.5 cursor-pointer hover:scale-105 transition-transform ${sizeClasses[size]} aspect-square ${className}`}
        onClick={onClick}
        title="HarryUp"
      >
        {/* Crisp vector emblem matching the official icon */}
        <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
          {/* Yellow H road curve */}
          <path
            d="M20 25 H34 V44 Q48 40 60 30 L64 36 Q48 48 34 50 V75 H20 Z"
            fill="#FFB800"
          />
          {/* U with Road Arrow */}
          <path
            d="M48 48 Q50 68 62 68 Q74 68 76 48 L76 34 L88 34 L88 50 Q86 80 62 80 Q38 80 36 48 Z"
            fill="#FFFFFF"
          />
          {/* Upward dynamic arrow */}
          <path
            d="M62 38 L84 18 L90 32 L84 28 L74 44 Z"
            fill="#FFB800"
          />
        </svg>
      </div>
    );
  }

  // Full horizontal brand logo matching the exact colors, typography, and styling
  return (
    <div
      dir="ltr"
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group ${className}`}
      onClick={onClick}
    >
      {/* Icon emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0b1a30] to-[#12284b] p-1.5 shadow-sm text-white group-hover:shadow-md transition-shadow ${sizeClasses[size]} aspect-square shrink-0`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Left H arm & curve */}
          <path
            d="M18 20 H32 V44 C44 40 56 32 64 26 L68 34 C58 41 46 48 32 50 V80 H18 Z"
            fill="#0062FF"
          />
          {/* Curved road loop */}
          <path
            d="M38 52 C38 72 52 82 66 82 C80 82 86 68 86 52 V36 H74 V50 C74 60 70 70 64 70 C58 70 52 62 52 50 Z"
            fill="#FFB800"
          />
          {/* Road dashes */}
          <path
            d="M45 42 L48 40 M55 35 L58 33 M67 27 L70 25"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Arrow pointing up-right */}
          <polygon
            points="70,16 94,16 94,40 85,31 72,44 64,36 78,24"
            fill="#0062FF"
          />
        </svg>
      </div>

      {/* Brand Name Typography: Harry (Blue) + Up (Yellow) */}
      <div dir="ltr" className="flex items-baseline tracking-tight font-extrabold">
        <span className={`text-[#0062FF] font-black ${textSizes[size]}`}>Harry</span>
        <span className={`text-[#FFB800] font-black ${textSizes[size]}`}>Up</span>
      </div>
    </div>
  );
};
