'use client';

import { analytics, logEvent } from '@/lib/firebase';
import { Search, X } from 'lucide-react';
import { FC } from 'react';

interface SearchFormProps {
  keyword: string;
  setKeyword: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  useGenreId: boolean;
  setUseGenreId: (value: boolean) => void;
  useAvailability: boolean;
  setUseAvailability: (value: boolean) => void;
  handleSearch: () => void;
  searchHistory: string[];
  loading: boolean;
  setPage: (value: number) => void;
  handleRemoveHistory: (target: string) => void;
}

const categories = [
  { name: 'ガンプラ', genreId: '201399', keyword: '' },
  { name: 'フィギュア', genreId: '201399', keyword: '' },
  { name: '書籍', genreId: '100040', keyword: '' },
  { name: 'アパレル', genreId: '100371', keyword: '' },
  { name: 'その他', genreId: '100000', keyword: '' },
];

const SearchForm: FC<SearchFormProps> = ({
  keyword,
  setKeyword,
  category,
  setCategory,
  useGenreId,
  setUseGenreId,
  useAvailability,
  setUseAvailability,
  handleSearch,
  searchHistory,
  loading,
  setPage,
  handleRemoveHistory,
}) => {
  return (
    <header className="bg-black bg-opacity-50 backdrop-blur-md shadow-lg sticky top-0 z-20 border-b border-purple-500 border-opacity-30">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-white">
            🚀 ガンダム商品検索
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex gap-4">
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={useGenreId}
                onChange={(e) => setUseGenreId(e.target.checked)}
                className="mr-2"
              />
              ジャンル検索を使用
            </label>
            <label className="flex items-center text-white">
              <input
                type="checkbox"
                checked={useAvailability}
                onChange={(e) => setUseAvailability(e.target.checked)}
                className="mr-2"
              />
              在庫ありのみ
            </label>
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
              if (analytics) {
                try {
                  logEvent(analytics, 'select_category', { category: e.target.value });
                } catch (error) {
                  console.warn('Failed to log select_category event:', error);
                }
              }
            }}
            className="border p-2 rounded bg-white bg-opacity-10 backdrop-blur-sm text-white border-purple-400 border-opacity-30 focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:w-32"
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name} className="bg-indigo-950">
                {cat.name}
              </option>
            ))}
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                const input = e.target.value.slice(0, 120);
                setKeyword(input);
                setPage(1);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="キーワードを入力（例：ガンプラ、RX-78、νガンダム）"
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-10 backdrop-blur-sm border border-purple-400 border-opacity-30 rounded-lg text-yellow-100 placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent" // 修正: text-gray-100で視認性向上
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 hover:bg-purple-700"
          >
            {loading ? '検索中...' : '検索'}
          </button>
        </div>
        {searchHistory.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-purple-200">最近の検索:</p>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((q: string) => (
                <div
                  key={q}
                  className="flex items-center gap-1 px-2 py-1 bg-white bg-opacity-10 rounded hover:bg-opacity-15 text-white"
                >
                  <button
                    onClick={() => {
                      setKeyword(q);
                      handleSearch();
                    }}
                    className="truncate max-w-[120px]"
                  >
                    {q}
                  </button>
                  <button
                    onClick={() => handleRemoveHistory(q)}
                    className="ml-1 text-purple-300 hover:text-purple-100"
                    aria-label="削除"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default SearchForm;