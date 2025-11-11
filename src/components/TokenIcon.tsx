import { useSelector } from 'react-redux';
import { RootState } from '../services/store';

interface TokenIconProps {
  size?: number;
  className?: string;
  symbol?: string;
  variant?: 'default' | 'crypto' | 'defi' | 'stable' | 'nft';
}

export default function TokenIcon({ 
  size = 40, 
  className = "",
  symbol,
  variant = 'default'
}: TokenIconProps) {
  // Get token info from Redux state
  const tokenInfo = useSelector((state: RootState) => 
    symbol ? state.tokens.tokens[symbol] : null
  );

  // If we have a logo from Redux, use it
  if (symbol && tokenInfo?.logo) {
    return (
      <div 
        className={`relative ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={tokenInfo.logo}
          alt={symbol}
          className="w-full h-full rounded-full object-cover"
          onError={(e) => {
            // Fallback to default icon if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // Fallback to default icon if no logo or symbol
  const getVariantStyles = () => {
    switch (variant) {
      case 'crypto':
        return 'bg-gradient-to-br from-yellow-400 to-orange-500';
      case 'defi':
        return 'bg-gradient-to-br from-blue-500 to-purple-600';
      case 'stable':
        return 'bg-gradient-to-br from-green-400 to-green-600';
      case 'nft':
        return 'bg-gradient-to-br from-pink-500 to-purple-600';
      default:
        return 'bg-gradient-to-br from-gray-600 to-gray-800';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'crypto':
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
          </svg>
        );
      case 'defi':
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M9 9h6v6H9z" fill="currentColor"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
          </svg>
        );
      case 'stable':
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="8" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        );
      case 'nft':
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        );
      default:
        return (
          <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          </svg>
        );
    }
  };

  return (
    <div 
      className={`${getVariantStyles()} rounded-full flex items-center justify-center text-white font-bold shadow-lg ${className}`}
      style={{ width: size, height: size }}
    >
      {getIcon()}
    </div>
  );
}
