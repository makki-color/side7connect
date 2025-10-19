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
    const [useGenreId, setUseGenreId] = useState(false);
    const [useAvailability, setUseAvailability] = useState(false);

    const categories = [
        { name: 'ガンプラ', genreId: '201399', keyword: '' },
        { name: 'フィギュア', genreId: '201399', keyword: '' },
        { name: '書籍', genreId: '100040', keyword: '' },
        { name: 'アパレル', genreId: '100371', keyword: '' },
        { name: 'その他', genreId: '100000', keyword: '' },
    ];

    const selectedCategory = categories.find((cat) => cat.name === category);
    const searchQuery = keyword.trim() || 'ガンプラ';

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
            } catch (err: any) {
                setRecommendedError('おすすめガンプラの取得に失敗しました。');
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
            setError('キーワードを2文字以上入力してください（例：ガンプラ、RX-78）。');
            setItems([]);
            console.log('Search aborted: Keyword too short');
            return;
        }
        setLoading(true);
        setError(null);
        setItems([]); // 検索前にリセット
        try {
            console.log('Search params:', { searchQuery, page, genreId: useGenreId ? selectedCategory?.genreId : null, availability: useAvailability ? 1 : 0 });
            const data = await fetchRakutenGoods(searchQuery, page, {
                genreId: useGenreId ? selectedCategory?.genreId : undefined,
                availability: useAvailability ? 1 : 0,
                category: selectedCategory?.name,
            });
            console.log('Rakuten API response:', data);
            setItems(data);
            console.log('Set items state:', data.length, 'Items:', data);
            if (data.length === 0) {
                setError(`「${searchQuery}」の検索結果が見つかりませんでした。別のキーワードを試してください（例：ガンプラ、RX-78、νガンダム）。`);
            }
            if (analytics) {
                try {
                    logEvent(analytics, 'search_goods', { category, searchQuery, page, useGenreId, useAvailability });
                } catch (error) {
                    console.warn('Failed to log search_goods event:', error);
                }
            }
        } catch (err: any) {
            const errorMessage =
                err.message.includes('無効な楽天APIキー')
                    ? '楽天APIキーの設定エラーです。管理者に連絡してください。'
                    : err.message.includes('keyword is not valid') || err.message.includes('keyword must be under 128 length')
                        ? 'キーワードが無効または長すぎます。128文字以内のキーワードを試してください（例：ガンプラ）。'
                        : err.message.includes('genreId must be under 999999')
                            ? 'ジャンル検索に失敗しました。キーワード検索のみで再試行してください。'
                            : `検索エラー: ${err.message}`;
            setError(errorMessage);
            console.error('Goods fetch error:', err);
            setItems([]);
        } finally {
            setLoading(false);
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

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">ガンダム商品検索</h1>
            <div className="mb-2 flex gap-4">
                <label>
                    <input
                        type="checkbox"
                        checked={useGenreId}
                        onChange={(e) => setUseGenreId(e.target.checked)}
                    />
                    <span className="ml-2">ジャンル検索を使用</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={useAvailability}
                        onChange={(e) => setUseAvailability(e.target.checked)}
                    />
                    <span className="ml-2">在庫ありのみ</span>
                </label>
            </div>
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
                        const input = e.target.value.slice(0, 120);
                        setKeyword(input);
                        setPage(1);
                    }}
                    placeholder="キーワードを入力（例：ガンプラ、RX-78、νガンダム）"
                    className="border p-2 flex-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
                >
                    {loading ? '検索中...' : '検索'}
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
                        {recommended.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                                <Image
                                    src={item.imageUrl || '/placeholder.png'}
                                    alt={item.itemName}
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    quality={75}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    className="w-full h-48 object-cover rounded"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.png';
                                    }}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">ガンプラ</span>
                                    <p className="font-semibold line-clamp-2">{item.itemName}</p>
                                </div>
                                <p className="font-bold text-lg">{item.itemPrice.toLocaleString()}円</p>
                                {item.reviewAverage && (
                                    <p className="text-sm text-yellow-500">
                                        ★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)
                                    </p>
                                )}
                                <a
                                    href={item.itemUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleItemClick(item)}
                                    className="text-blue-500 hover:underline block mt-2"
                                >
                                    詳細を見る →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 検索結果 */}
            {items.length > 0 ? (
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">検索結果（{items.length}件）</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="border p-4 rounded shadow hover:shadow-lg transition-shadow">
                                <Image
                                    src={item.imageUrl || '/placeholder.png'}
                                    alt={item.itemName}
                                    width={300}
                                    height={300}
                                    loading="lazy"
                                    quality={90}
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                    className="w-full h-48 object-cover rounded"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.png';
                                    }}
                                />
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{category}</span>
                                    <p className="font-semibold line-clamp-2">{item.itemName}</p>
                                </div>
                                <p className="font-bold text-lg">{item.itemPrice.toLocaleString()}円</p>
                                {item.reviewAverage && (
                                    <p className="text-sm text-yellow-500">
                                        ★ {item.reviewAverage.toFixed(1)} ({item.reviewCount || 0}件)
                                    </p>
                                )}
                                <a
                                    href={item.itemUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleItemClick(item)}
                                    className="text-blue-500 hover:underline block mt-2"
                                >
                                    詳細を見る →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                !loading && !error && recommended.length === 0 && <p className="text-gray-500 mt-8">検索ボタンを押してガンダムグッズを探してください！</p>
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