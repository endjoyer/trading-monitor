import { useState, useEffect } from 'react';
import { stockService } from '@/services/stockService';
import { CandleData } from '@/utils/indicators';

export const useStockChart = (symbol: string) => {
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const to = Math.floor(Date.now() / 1000);
        const from = to - 60 * 60 * 24 * 30; // 30 days
        const data = await stockService.getCandles(symbol, from, to, 'D');

        if (data && Array.isArray(data.t) && data.t.length > 0) {
          const candles: CandleData[] = data.t.map(
            (time: number, i: number) => ({
              time,
              open: data.o[i],
              high: data.h[i],
              low: data.l[i],
              close: data.c[i],
            })
          );

          setCandleData(candles);
        } else {
          setError('No data available');
        }
      } catch (error) {
        console.error('Error fetching candle data:', error);
        setError('Failed to load chart data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [symbol]);

  return { candleData, isLoading, error };
};
