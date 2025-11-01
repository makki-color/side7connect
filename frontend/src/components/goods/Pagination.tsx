'use client';

import { FC } from 'react';

interface PaginationProps {
  page: number;
  setPage: (value: number) => void;
  handleSearch: () => void;
  loading: boolean;
  hasNextPage: boolean;
}

const Pagination: FC<PaginationProps> = ({ page, setPage, handleSearch, loading, hasNextPage }) => {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button
        onClick={() => {
          setPage((prev) => Math.max(prev - 1, 1));
          handleSearch();
        }}
        disabled={page === 1 || loading}
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 hover:bg-purple-700"
      >
        前のページ
      </button>
      <span className="text-white">ページ {page}</span>
      <button
        onClick={() => {
          setPage((prev) => prev + 1);
          handleSearch();
        }}
        disabled={!hasNextPage || loading}
        className="px-4 py-2 bg-purple-600 text-white rounded disabled:opacity-50 hover:bg-purple-700"
      >
        次のページ
      </button>
    </div>
  );
};

export default Pagination;