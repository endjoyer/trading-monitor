import { FC } from 'react';
import { StockFilter } from '@/types/stock';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: StockFilter;
  onFilterChange: (filter: StockFilter) => void;
}

export const SearchBar: FC<SearchBarProps> = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Поиск по символу..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      />
      <div className="flex gap-2">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Все
        </button>
        <button
          onClick={() => onFilterChange('growing')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'growing'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Растущие
        </button>
        <button
          onClick={() => onFilterChange('falling')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'falling'
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Падающие
        </button>
      </div>
    </div>
  );
};
