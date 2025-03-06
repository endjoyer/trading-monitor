import { FC } from 'react';
import { Stock } from '@/types/stock';

interface StockListProps {
  stocks: Stock[];
  isLoading: boolean;
  onSelectStock?: (symbol: string) => void;
  selectedSymbol?: string;
}

export const StockList: FC<StockListProps> = ({
  stocks,
  isLoading,
  onSelectStock,
  selectedSymbol,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Символ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Цена
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Изменение
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Изменение %
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {stocks.map((stock) => (
            <tr
              key={stock.symbol}
              onClick={() => onSelectStock?.(stock.symbol)}
              className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                selectedSymbol === stock.symbol
                  ? 'bg-blue-50 dark:bg-blue-900/30'
                  : ''
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {stock.symbol}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                ${stock.quote.c.toFixed(2)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.quote.d >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stock.quote.d >= 0 ? '+' : ''}
                {stock.quote.d.toFixed(2)}
              </td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.quote.dp >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stock.quote.dp >= 0 ? '+' : ''}
                {stock.quote.dp.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
