import axios from 'axios';
import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from './config';
import type { StockQuote } from '../types/stock';

const api = axios.create({
  baseURL: FINNHUB_BASE_URL,
  params: {
    token: FINNHUB_API_KEY,
  },
});

export const stockService = {
  async getQuote(symbol: string): Promise<StockQuote> {
    const { data } = await api.get(`/quote`, {
      params: { symbol },
    });
    return data;
  },

  async getCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: string
  ) {
    const { data } = await api.get(`/stock/candle`, {
      params: {
        symbol,
        from,
        to,
        resolution,
      },
    });
    return data;
  },
};
