import { useQuery } from 'react-query';
import { stockService } from '@/services/stockService';
import {
  STOCK_SYMBOLS,
  UPDATE_INTERVAL,
  ITEMS_PER_PAGE,
} from '@/services/config';
import { Stock, StockFilter } from '@/types/stock';
import { useState, useMemo } from 'react';

export const useStocks = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const paginatedStocks = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredStocks, currentPage]);

  const totalPages = Math.ceil(filteredStocks.length / ITEMS_PER_PAGE);

  return {
    stocks: paginatedStocks,
    totalStocks: filteredStocks.length,
    isLoading,
    search,
    setSearch,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
