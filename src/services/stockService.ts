import axios from 'axios';
import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from './config';
import type { StockQuote } from '../types/stock';

const api = axios.create({
  baseURL: FINNHUB_BASE_URL,
  params: {
    token: FINNHUB_API_KEY,
  },
});

// Заглушечные данные для демонстраци (платный API)
const mockCandles = {
  t: Array.from(
    { length: 30 },
    (_, i) => Math.floor(Date.now() / 1000) - (29 - i) * 86400
  ),
  o: Array.from({ length: 30 }, () => 150 + Math.random() * 10),
  h: Array.from({ length: 30 }, () => 155 + Math.random() * 10),
  l: Array.from({ length: 30 }, () => 145 + Math.random() * 10),
  c: Array.from({ length: 30 }, () => 152 + Math.random() * 10),
  s: 'ok',
};

export const stockService = {
  async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const { data } = await api.get(`/quote`, {
        params: { symbol },
      });
      return data;
    } catch (error) {
      // Заглушечные данные при ошибке
      return {
        c: 150 + Math.random() * 10,
        d: Math.random() * 2 - 1,
        dp: Math.random() * 2 - 1,
        h: 155 + Math.random() * 10,
        l: 145 + Math.random() * 10,
        o: 150 + Math.random() * 10,
        pc: 149 + Math.random() * 10,
        t: Math.floor(Date.now() / 1000),
      };
    }
  },

  async getCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: string
  ) {
    try {
      const { data } = await api.get(`/stock/candle`, {
        params: {
          symbol,
          from,
          to,
          resolution,
        },
      });
      if (data.s === 'ok') {
        return data;
      }
      return mockCandles;
    } catch (error) {
      return mockCandles;
    }
  },
};
