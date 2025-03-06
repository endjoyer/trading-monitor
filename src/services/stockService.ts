import axios from 'axios';
import type { StockQuote } from '../types/stock';

const api = axios.create({
  baseURL: '/api/finnhub',
});

const generateMockCandles = (symbol: string, from: number, to: number) => {
  const days = Math.floor((to - from) / (60 * 60 * 24));
  const basePrice = 150;
  const volatility = 10;

  return {
    s: 'ok',
    t: Array.from({ length: days }, (_, i) => from + i * 60 * 60 * 24),
    o: Array.from(
      { length: days },
      () => basePrice + (Math.random() - 0.5) * volatility
    ),
    h: Array.from(
      { length: days },
      () => basePrice + Math.random() * volatility
    ),
    l: Array.from(
      { length: days },
      () => basePrice - Math.random() * volatility
    ),
    c: Array.from(
      { length: days },
      () => basePrice + (Math.random() - 0.5) * volatility
    ),
  };
};

const quotesCache = new Map<string, StockQuote>();

export const stockService = {
  async getQuotesForPage(symbols: string[]): Promise<Map<string, StockQuote>> {
    const results = new Map<string, StockQuote>();

    try {
      symbols.forEach((symbol) => {
        const cached = quotesCache.get(symbol);
        if (cached) {
          results.set(symbol, cached);
        }
      });

      // Запрашиваем данные по 5 символов за раз
      for (let i = 0; i < symbols.length; i += 5) {
        const chunk = symbols.slice(i, i + 5);
        const quotes = await Promise.all(
          chunk.map(async (symbol) => {
            try {
              const { data } = await api.get('', {
                params: {
                  endpoint: 'quote',
                  symbol,
                },
              });

              if (data && typeof data.c === 'number') {
                quotesCache.set(symbol, data);
                return { symbol, quote: data };
              }

              const cached = quotesCache.get(symbol);
              if (cached) {
                return { symbol, quote: cached };
              }

              return null;
            } catch (error) {
              const cached = quotesCache.get(symbol);
              if (cached) {
                return { symbol, quote: cached };
              }
              console.error(`Error fetching quote for ${symbol}:`, error);
              return null;
            }
          })
        );

        quotes.forEach((result) => {
          if (result) {
            results.set(result.symbol, result.quote);
          }
        });

        if (i + 5 < symbols.length) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);

      symbols.forEach((symbol) => {
        const cached = quotesCache.get(symbol);
        if (cached) {
          results.set(symbol, cached);
        }
      });
    }

    return results;
  },

  async getCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: string
  ) {
    const cacheKey = `candles_${symbol}_${from}_${to}_${resolution}`;

    try {
      const { data } = await api.get('', {
        params: {
          endpoint: 'stock/candle',
          symbol,
          from,
          to,
          resolution,
        },
      });

      if (
        data &&
        data.s === 'ok' &&
        Array.isArray(data.t) &&
        data.t.length > 0
      ) {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        return data;
      }

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        if (
          parsedCache.s === 'ok' &&
          Array.isArray(parsedCache.t) &&
          parsedCache.t.length > 0
        ) {
          return parsedCache;
        }
      }

      return generateMockCandles(symbol, from, to);
    } catch (error) {
      console.error('Error fetching candles:', error);

      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsedCache = JSON.parse(cached);
          if (
            parsedCache.s === 'ok' &&
            Array.isArray(parsedCache.t) &&
            parsedCache.t.length > 0
          ) {
            return parsedCache;
          }
        } catch (e) {
          console.error('Error parsing cached data:', e);
        }
      }

      // В случае любой ошибки возвращаем мок-данные
      return generateMockCandles(symbol, from, to);
    }
  },
};
