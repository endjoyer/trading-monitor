import { useQuery } from 'react-query';
import { stockService } from '@/services/stockService';
import { STOCK_SYMBOLS, ITEMS_PER_PAGE } from '@/services/config';
import { Stock, StockFilter } from '@/types/stock';
import { useState, useMemo } from 'react';

export const useStocks = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<StockFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSymbols = useMemo(() => {
    return STOCK_SYMBOLS.filter((symbol) =>
      symbol.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const currentPageSymbols = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSymbols.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredSymbols, currentPage]);

  const { data: quotesMap = new Map(), isLoading } = useQuery(
    ['stocks', currentPageSymbols.join()],
    () => stockService.getQuotesForPage(currentPageSymbols),
    {
      refetchInterval: 5000,
      keepPreviousData: true,
      retry: 2,
    }
  );

  const stocks = useMemo(() => {
    return Array.from(quotesMap.entries())
      .map(([symbol, quote]) => ({
        symbol,
        quote,
        isGrowing: quote.c > quote.o,
      }))
      .filter((stock) => {
        if (filter === 'growing') return stock.isGrowing;
        if (filter === 'falling') return !stock.isGrowing;
        return true;
      });
  }, [quotesMap, filter]);

  const totalPages = Math.ceil(filteredSymbols.length / ITEMS_PER_PAGE);

  return {
    stocks,
    totalStocks: filteredSymbols.length,
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
