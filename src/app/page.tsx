'use client';

import { Layout } from '@/components/Layout/Layout';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { StockList } from '@/components/StockList/StockList';
import { StockChart } from '@/components/StockChart/StockChart';
import { StockSelector } from '@/components/StockSelector/StockSelector';
import { useStocks } from '@/hooks/useStocks';
import { useStockChart } from '@/hooks/useStockChart';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useState } from 'react';
import { STOCK_SYMBOLS } from '@/services/config';

const queryClient = new QueryClient();

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
  const { stocks, isLoading, search, setSearch, filter, setFilter } =
    useStocks();
  const { candleData, isLoading: isChartLoading } =
    useStockChart(selectedSymbol);

  return (
    <>
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      <StockList stocks={stocks} isLoading={isLoading} />
      <div className="mt-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-xl font-bold dark:text-white">График</h2>
          <StockSelector
            selectedSymbol={selectedSymbol}
            onSymbolChange={setSelectedSymbol}
          />
        </div>
        {isChartLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <StockChart data={candleData} symbol={selectedSymbol} />
        )}
      </div>
    </>
  );
}
