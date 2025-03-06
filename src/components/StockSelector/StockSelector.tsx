import { FC } from 'react';
import { STOCK_SYMBOLS } from '@/services/config';

interface StockSelectorProps {
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
}

export const StockSelector: FC<StockSelectorProps> = ({
  selectedSymbol,
  onSymbolChange,
}) => {
  return (
    <select
      value={selectedSymbol}
      onChange={(e) => onSymbolChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    >
      {STOCK_SYMBOLS.map((symbol) => (
        <option key={symbol} value={symbol}>
          {symbol}
        </option>
      ))}
    </select>
  );
};
