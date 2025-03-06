'use client';

import { Layout } from '@/components/Layout/Layout';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { StockList } from '@/components/StockList/StockList';
import { StockChart } from '@/components/StockChart/StockChart';
import { useStocks } from '@/hooks/useStocks';
import { useStockChart } from '@/hooks/useStockChart';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { STOCK_SYMBOLS } from '@/services/config';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <div className="space-y-8">
          <StocksContent />
        </div>
      </Layout>
    </QueryClientProvider>
  );
}

function StocksContent() {
  const [selectedSymbol, setSelectedSymbol] = useState(STOCK_SYMBOLS[0]);
  const {
    stocks,
    isLoading,
    search,
    setSearch,
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    totalStocks,
  } = useStocks();
  const { candleData, isLoading: isChartLoading } =
    useStockChart(selectedSymbol);

  // Сброс страницы при изменении поиска или фильтра
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: any) => {
    setFilter(value);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="space-y-4">
        <SearchBar
          search={search}
          onSearchChange={handleSearchChange}
          filter={filter}
          onFilterChange={handleFilterChange}
        />
        <StockList
          stocks={stocks}
          isLoading={isLoading}
          onSelectStock={setSelectedSymbol}
          selectedSymbol={selectedSymbol}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalStocks={totalStocks}
        />
      </div>
      <div className="mt-8">
        <StockChart data={candleData} symbol={selectedSymbol} />
      </div>
    </>
  );
}
