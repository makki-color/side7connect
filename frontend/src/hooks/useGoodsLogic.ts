'use client';

import { analytics, logEvent } from '@/lib/firebase';
import { fetchRakutenGoods, GoodsItem, RakutenApiError } from '@/lib/rakuten';
import { removeSearchHistoryItem, saveSearchHistory } from '@/utils/goodsUtils';
import { useEffect, useState } from 'react';
// エラー型ガード
const isRakutenApiError = (error: unknown): error is RakutenApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as RakutenApiError).message === 'string'
  );
};

const useGoodsLogic = () => {
  const [items, setItems] = useState<GoodsItem[]>([]);
  const [recommended, setRecommended] = useState<GoodsItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('ガンプラ');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);
  const [useGenreId, setUseGenreId] = useState(false);
  const [useAvailability, setUseAvailability] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 追加: viewMode管理
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const categories = [
    { name: 'ガンプラ', genreId: '201399', keyword: '' },
    { name: 'フィギュア', genreId: '201399', keyword: '' },
    { name: '書籍', genreId: '100040', keyword: '' },
    { name: 'アパレル', genreId: '100371', keyword: '' },
    { name: 'その他', genreId: '100000', keyword: '' },
  ];

  const selectedCategory = categories.find((cat) => cat.name === category);
  const searchQuery = keyword.trim() || selectedCategory?.name || 'ガンプラ'; // 修正: カテゴリに基づくクエリ調整

  // 検索履歴の初期化
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
      setSearchHistory(history);
    }
  }, []);

  // おすすめ商品の取得
  useEffect(() => {
    async function loadRecommended() {
      setLoading(true);
      try {
        const data = await fetchRakutenGoods('ガンプラ', 1, {
          genreId: undefined,
          sort: 'standard',
          availability: 0,
          category: 'ガンプラ',
        });
        console.log('Recommended API response:', data);
        setRecommended(data.slice(0, 5));
        console.log('Set recommended state:', data.slice(0, 5).length);
        if (data.length === 0) {
          setRecommendedError('おすすめガンプラが見つかりませんでした。');
        }
      } catch (err: unknown) {
        const errorMessage = isRakutenApiError(err)
          ? err.message
          : 'おすすめガンプラの取得に失敗しました。';
        setRecommendedError(errorMessage);
        console.error('Recommended fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecommended();
  }, []);

  const handleSearch = async () => {
    if (searchQuery.length > 128) {
      setError('キーワードが長すぎます。128文字以内で入力してください。');
      setItems([]);
      console.log('Search aborted: Keyword too long');
      return;
    }
    if (searchQuery.length < 2) {
      setError('キーワードを2文字以上入力してください（例：ガンプラ、RX-78、νガンダム）。');
      setItems([]);
      console.log('Search aborted: Keyword too short');
      return;
    }
    setLoading(true);
    setError(null);
    setItems([]);
    setIsLoading(true);   // ← 追加
    setIsError(false);    // ← 追加
    setItems([]);
    try {
      console.log('Search params:', {
        searchQuery,
        page,
        genreId: useGenreId ? selectedCategory?.genreId : null,
        availability: useAvailability ? 1 : 0,
      });
      const data = await fetchRakutenGoods(searchQuery, page, {
        genreId: useGenreId ? selectedCategory?.genreId : undefined,
        availability: useAvailability ? 1 : 0,
        category: selectedCategory?.name,
      });
      console.log('Rakuten API response:', data);
      setItems(data);
      console.log('Set items state:', data.length, 'Items:', data);
      if (data.length === 0) {
        setError(
          `「${searchQuery}」の検索結果が見つかりませんでした。別のキーワードを試してください（例：ガンプラ、RX-78、νガンダム）。`
        );
      } else {
        saveSearchHistory(searchQuery, setSearchHistory);
      }
      if (analytics) {
        try {
          logEvent(analytics, 'search_goods', {
            category,
            searchQuery,
            page,
            useGenreId,
            useAvailability,
          });
        } catch (error) {
          console.warn('Failed to log search_goods event:', error);
        }
      }
      setIsLoading(false);
    } catch (err: unknown) {
      let errorMessage: string;
      if (isRakutenApiError(err)) {
        if (err.message.includes('無効な楽天APIキー')) {
          errorMessage = '楽天APIキーの設定エラーです。管理者に連絡してください。';
        } else if (
          err.message.includes('keyword is not valid') ||
          err.message.includes('keyword must be under 128 length')
        ) {
          errorMessage =
            'キーワードが無効または長すぎます。128文字以内のキーワードを試してください（例：ガンプラ）。';
        } else if (err.message.includes('genreId must be under 999999')) {
          errorMessage = 'ジャンル検索に失敗しました。キーワード検索のみで再試行してください。';
        } else {
          errorMessage = `検索エラー: ${err.message}`;
        }
      } else {
        errorMessage = '検索中に不明なエラーが発生しました。';
      }
      setError(errorMessage);
      console.error('Goods fetch error:', err);
      setItems([]);
      setIsError(true);   // ← 追加
      setIsLoading(false);
    } finally {
      setLoading(false);
      setIsLoading(false);
      console.log('Search completed, loading:', false, 'items length:', items.length);
    }
  };

  const handleItemClick = (item: GoodsItem) => {
    if (analytics) {
      try {
        logEvent(analytics, 'goods_click', { itemName: item.itemName, category });
      } catch (error) {
        console.warn('Failed to log goods_click event:', error);
      }
    }
  };

  const handleRemoveHistory = (target: string) => {
    removeSearchHistoryItem(target, setSearchHistory);
  };

  return {
    items,
    recommended,
    keyword,
    setKeyword,
    category,
    setCategory,
    page,
    setPage,
    loading,
    error,
    recommendedError,
    useGenreId,
    setUseGenreId,
    useAvailability,
    setUseAvailability,
    searchHistory,
    handleSearch,
    handleItemClick,
    viewMode, // 追加: viewMode返却
    setViewMode, // 追加: setViewMode返却
    isLoading,          // ← 追加
    isError,            // ← 追加
    handleRemoveHistory // ← 追加
  };
};

export default useGoodsLogic;