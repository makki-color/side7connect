'use client';

import { analytics, logEvent } from '@/lib/firebase';
import { fetchRakutenGoods, GoodsItem } from '@/lib/rakuten';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function GoodsPage() {
  const [items, setItems] = useState<GoodsItem[]>([]);
  const [recommended, setRecommended] = useState<GoodsItem[]>([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('ガンプラ');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendedError, setRecommendedError] = useState<string | null>(null);

  const categories = [
    { name: 'ガンプラ', genreId: '558108', keyword: 'プラモデル' },
    { name: 'フィギュア', genreId: '1000002', keyword: 'フィギュア' },
    { name: '書籍', genreId: '1000004', keyword: '書籍' },
    { name: 'アパレル', genreId: '1000003', keyword: 'アパレル' },
    { name: 'その他', genreId: '1000005', keyword: 'グッズ' },
  ];

  const selectedCategory = categories.find((cat) => cat.name === category);
  const searchQuery = `${selectedCategory?.keyword} ${keyword.trim()}`.trim();

  // 検索ボタンの処理
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setError('キーワードを2文字以上入力してください（例：νガンダム）。');
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRakutenGoods(searchQuery, page, {
        genreId: selectedCategory?.genreId,
        availability: 1,
        category: selectedCategory?.name,
      });
      setItems(data);
      // Analytics: 検索実行を記録
      if (analytics) {
        try {
          logEvent(analytics, 'search_goods', { category, searchQuery, page });
        } catch (error) {
          console.warn('Failed to log search_goods event:', error);
        }
      }
    } catch (err: any) {
      const errorMessage =
        err.message.includes('keyword is not valid')
          ? '無効なキーワードです。別のキーワードを試してください（例：νガンダム）。'
          : err.message.includes('Rakuten API key')
            ? 'サーバー設定エラーです。管理者に連絡してください。'
            : `「${selectedCategory?.name}」の商品を取得できませんでした。別のカテゴリやキーワードを試してください。`;
      setError(errorMessage);
      console.error('Goods fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // おすすめガンプラ
  useEffect(() => {
    async function loadRecommended() {
      try {
        const data = await fetchRakutenGoods('ガンダム プラモデル', 1, {
          genreId: '558108',
          sort: 'standard',
          availability: 1,
          category: 'ガンプラ',
        });
        setRecommended(data.slice(0, 5));
      } catch (err: any) {
        setRecommendedError('おすすめガンプラの取得に失敗しました。');
        console.error('Recommended fetch error:', err);
      }
    }
    loadRecommended();
  }, []);

  const handleItemClick = (item: GoodsItem) => {
    if (analytics) {
      try {
        logEvent(analytics, 'goods_click', { itemName: item.itemName, category });
      } catch (error) {
        console.warn('Failed to log goods_click event:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ガンダム商品検索</h1>
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
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
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-32"
        >
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          placeholder={`キーワードを入力（例：${category === 'ガンプラ' ? 'νガンダム' : category === 'フィギュア' ? 'ロボット魂' : 'コミック'}）`}
          className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
        >
          検索
        </button>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-500">読み込み中...</p>}

      {/* おすすめガンプラ */}
      {recommendedError && <p className="text-red-500 mb-4">{recommendedError}</p>}
      {recommended.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">おすすめガンプラ</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recommended.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                <Image
                  src={item.imageUrl}
                  alt={item.itemName}
                  width={300}
                  height={300}
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">ガンプラ</span>
                  <p className="font-semibold line-clamp-2">{item.itemName}</p>
                </div>
                <p>{item.itemPrice}円</p>
                {item.reviewAverage && (
                  <p className="text-sm text-yellow-500">
                    ★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)
                  </p>
                )}
                <a
                  href={item.itemUrl}
                  onClick={() => handleItemClick(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  詳細を見る
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 検索結果 */}
      {items.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">検索結果</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                <Image
                  src={item.imageUrl}
                  alt={item.itemName}
                  width={300}
                  height={300}
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="w-full h-48 object-cover rounded"
                />
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{category}</span>
                  <p className="font-semibold line-clamp-2">{item.itemName}</p>
                </div>
                <p>{item.itemPrice}円</p>
                {item.reviewAverage && (
                  <p className="text-sm text-yellow-500">
                    ★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)
                  </p>
                )}
                <a
                  href={item.itemUrl}
                  onClick={() => handleItemClick(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  詳細を見る
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ページネーション */}
      {items.length > 0 && (
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 1));
              handleSearch();
            }}
            disabled={page === 1 || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            前のページ
          </button>
          <span>ページ {page}</span>
          <button
            onClick={() => {
              setPage((prev) => prev + 1);
              handleSearch();
            }}
            disabled={items.length < 30 || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
          >
            次のページ
          </button>
        </div>
      )}

      {/* 広告スペース */}
      <div className="mt-8 hidden md:block">
        <div className="w-[300px] h-[250px] bg-gray-200 text-center flex items-center justify-center sticky top-4">
          広告 (300x250)
        </div>
      </div>
    </div>
  );
}