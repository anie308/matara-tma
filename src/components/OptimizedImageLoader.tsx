import React, { useState, useEffect } from 'react';
import { ImagePlus, XCircle } from 'lucide-react';

interface OptimizedImageLoaderProps {
  src: string;
  alt: string;
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  height?: string | number;
  width?: string | number;
}

const OptimizedImageLoader: React.FC<OptimizedImageLoaderProps> = ({ 
  src, 
  alt, 
  quality = 0.8, 
  maxWidth = 1920, 
  maxHeight = 1080,
  height, // New prop for fixed height
  width = '100%', // Optional width prop with default
}) => {
  const [imageState, setImageState] = useState<{
    loading: boolean;
    error: boolean;
    src: string | null;
  }>({
    loading: true,
    error: false,
    src: null
  });

  useEffect(() => {
    const loadImage = async () => {
      try {
        const img = new Image();
        img.src = src;
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const compressedSrc = await compressImage(img, quality, maxWidth, maxHeight) as string;
        
        setImageState({
          loading: false,
          error: false,
          src: compressedSrc
        });
      } catch (error) {
        setImageState({
          loading: false,
          error: true,
          src: null
        });
      }
    };

    loadImage();
  }, [src, quality, maxWidth, maxHeight]);

  const compressImage = (img: CanvasImageSource, quality: number | undefined, maxWidth: number, maxHeight: number): Promise<string> => {
    return new Promise<string>((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const imageElement = img as HTMLImageElement;
      let width = imageElement.width;
      let height = imageElement.height;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      const compressedSrc = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedSrc);
    });
  };

  const handleRetry = () => {
    setImageState({
      loading: true,
      error: false,
      src: null
    });
  };

  
  

  

  return (
    <img
      src={imageState.src || ""}
      alt={alt}
      className="bg-transparent"
      style={{
        width: width,
        height: height,
      }}
      loading="lazy"
    />
  );
};

export default OptimizedImageLoader;