import { useState, useEffect } from "react";
import { CoinLogoService } from "../services/coinLogos";

export const useTokenLogos = (tokenAddresses: string[]) => {
  const [logos, setLogos] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadLogos = async () => {
      if (tokenAddresses.length === 0) return;

      setIsLoading(true);
      
      try {
        const metadataMap = await CoinLogoService.getMultipleTokens(tokenAddresses);
        const logoMap = new Map<string, string>();
        
        metadataMap.forEach((metadata, address) => {
          if (metadata.image) {
            logoMap.set(address.toLowerCase(), metadata.image);
          }
        });
        
        setLogos(logoMap);
      } catch (error) {
        console.error("Error loading token logos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLogos();
  }, [tokenAddresses.join(',')]);

  const getLogo = (address: string): string => {
    return logos.get(address.toLowerCase()) || "/tokens/default.png";
  };

  return {
    logos,
    isLoading,
    getLogo
  };
};
