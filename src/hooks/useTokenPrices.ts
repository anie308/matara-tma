import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../services/store';
import { initializeTokenPrices, updateAllTokenPrices } from '../services/redux/tokens';

/**
 * Hook to manage token price updates with automatic refresh timer
 * This prevents multiple API calls by centralizing price updates in Redux
 */
export const useTokenPrices = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { priceUpdateInterval, lastPriceUpdate, isUpdatingPrices } = useSelector(
    (state: RootState) => state.tokens
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize prices on mount
    dispatch(initializeTokenPrices());

    // Set up interval to update prices periodically
    intervalRef.current = setInterval(() => {
      dispatch(updateAllTokenPrices());
    }, priceUpdateInterval);

    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, priceUpdateInterval]);

  return {
    lastPriceUpdate,
    isUpdatingPrices,
    priceUpdateInterval,
  };
};

