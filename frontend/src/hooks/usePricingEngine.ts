import { useState, useEffect } from 'react';
import { useCustomizerStore } from '../store/customizerStore';
import api from '../services/api';

export const usePricingEngine = () => {
  const { width, height, material, setPrice } = useCustomizerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (width < 1 || width > 50 || height < 1 || height > 50) {
        setError('Dimensions must be between 1cm and 50cm.');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post('/pricing/calculate', { width, height, material });
        setPrice(response.data.data.price);
      } catch (err: any) {
        // Fallback to client-side calculation if API is unreachable
        const mockBase = material === 'GOLD' ? 50 : 20;
        const calcPrice = (width * height) * mockBase * 1.2;
        setPrice(parseFloat(calcPrice.toFixed(2)));
        setError(null); // Don't show error for fallback
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: 500ms to avoid spamming API while user is typing
    const timeoutId = setTimeout(fetchPrice, 500);
    return () => clearTimeout(timeoutId);
  }, [width, height, material, setPrice]);

  return { isLoading, error };
};
