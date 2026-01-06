import { useState, useEffect } from "react";
import { CoinLogoService } from "../services/coinLogos";
import TokenIcon from "./TokenIcon";

interface TokenLogoProps {
  symbol: string;
  address: string;
  size?: number;
  className?: string;
  fallback?: string;
  variant?: 'default' | 'crypto' | 'defi' | 'stable' | 'nft';
}

export default function TokenLogo({ 
  symbol, 
  address, 
  size = 40, 
  className = "",
  fallback = "/tokens/default.png",
  variant = 'default'
}: TokenLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLogo = async () => {
      if (address === "native") {
        // For native tokens like BNB, use a default logo
        setLogoUrl("https://cdn.dexscreener.com/cms/images/d33c76a1c7bb23e4de0e83553377c191453dfc36f114393a0e012ea509060908?width=128&height=128&fit=crop&quality=95&format=auto");
        return;
      }

      setIsLoading(true);
      
      try {
        // Check cache first
        const cached = CoinLogoService.getCachedMetadata(address);
        if (cached?.image) {
          setLogoUrl(cached.image);
          setIsLoading(false);
          return;
        }

        // Fetch from DexScreener API
        const metadata = await CoinLogoService.getTokenByContract(address);
        if (metadata?.image) {
          setLogoUrl(metadata.image);
        } else {
          setLogoUrl(fallback);
        }
      } catch (error) {
        console.error(`Error loading logo for ${symbol}:`, error);
        setLogoUrl(fallback);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, [address, symbol, fallback]);

  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading ? (
        <div className="w-full h-full bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logoUrl && logoUrl !== fallback ? (
        <img
          src={logoUrl}
          alt={symbol}
          className="w-full h-full rounded-full object-cover border-gray-300"
          onError={() => setLogoUrl('')}
        />
      ) : (
        <TokenIcon 
          symbol={symbol} 
          size={size} 
          variant={variant}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
