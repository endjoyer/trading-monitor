import { useQuery } from 'react-query';
import { stockService } from '@/services/stockService';
import { STOCK_SYMBOLS, UPDATE_INTERVAL } from '@/services/config';
import { Stock, StockFilter } from '@/types/stock';
import { useState, useMemo } from 'react';

export const useStocks = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');

  const { data: stocks = [], isLoading } = useQuery(
    'stocks',
    async () => {
      const quotes = await Promise.all(
        STOCK_SYMBOLS.map(async (symbol) => {
          const quote = await stockService.getQuote(symbol);
          return {
            symbol,
            quote,
            isGrowing: quote.c > quote.o,
          };
        })
      );
      return quotes;
    },
    {
      refetchInterval: UPDATE_INTERVAL,
    }
  );

  const filteredStocks = useMemo(() => {
    return stocks
      .filter((stock) =>
        stock.symbol.toLowerCase().includes(search.toLowerCase())
      )
      .filter((stock) => {
        if (filter === 'growing') return stock.isGrowing;
        if (filter === 'falling') return !stock.isGrowing;
        return true;
      });
  }, [stocks, search, filter]);

  return {
    stocks: filteredStocks,
    isLoading,
    search,
    setSearch,
    filter,
    setFilter,
  };
};
