// import React from 'react';

interface DefaultTokenIconProps {
  size?: number;
  className?: string;
  symbol?: string;
}

export default function DefaultTokenIcon({ 
  size = 40, 
  className = ""
}: DefaultTokenIconProps) {
  return (
    <div 
      className={`bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.6}
        height={size * 0.6}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Coin/Token Icon */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="6"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="12"
          cy="12"
          r="2"
          fill="currentColor"
        />
        {/* Decorative lines */}
        <path
          d="M6 6L18 18M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
