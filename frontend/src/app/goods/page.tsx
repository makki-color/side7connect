'use client';
import debounce from 'lodash/debounce';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GoodsItem {
    id: number;
    itemName: string;
    itemPrice: number;
    itemUrl: string;
    imageUrl: string;
}

export default function GoodsPage() {
    const [goods, setGoods] = useState<GoodsItem[]>([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const limit = typeof window !== 'undefined' && window.innerWidth < 640 ? 30 : 100;

    const fetchGoods = debounce(() => {
        fetch('/data/goods.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch goods.json');
                return res.json();
            })
            .then(data => setGoods(data.filter((item: GoodsItem) =>
                item.itemName.toLowerCase().includes(search.toLowerCase())
            ).slice((page - 1) * limit, page * limit)))
            .catch(err => console.error('Fetch error:', err));
    }, 500);

    useEffect(() => {
        console.log('Goods:', goods); // デバッグ用
        fetchGoods();
    }, [page, search]);

    return (
        <>
            <Head>
                <title>Side7Connect | ガンプラ＆グッズ</title>
                <meta name="description" content="最新ガンプラを最安値で！RX-78、ユニコーン、ザクIIをチェック！" />
            </Head>
            <div className="bg-blue-900 text-white min-h-screen p-4 bg-gradient-to-r from-blue-900 to-gray-800">
                <h1 className="text-3xl font-bold mb-4 text-center">ガンプラ＆グッズ</h1>
                <input
                    type="text"
                    placeholder="RGνガンダムをロックオン！"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-2 mb-4 text-black rounded-lg border-2 border-white"
                    tabIndex={0}
                    aria-label="ガンプラを検索"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {goods.length ? goods.map((item: GoodsItem) => (
                        <div key={item.id} className="border-2 border-white rounded-lg p-2 hover:scale-105 transition-transform">
                            <div className="relative">
                                <Image
                                    src={item.imageUrl || 'https://via.placeholder.com/200x200/4682B4/FFFFFF?text=Mecha'}
                                    alt={item.itemName}
                                    width={200}
                                    height={200}
                                    loading="lazy"
                                    className="w-full h-48 object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs p-1 rounded">
                                    ジオン兵#123推し！
                                </span>
                            </div>
                            <h2 className="text-lg font-semibold">{item.itemName}</h2>
                            <p>¥{item.itemPrice}</p>
                            <a href={item.itemUrl} className="bg-red-600 hover:bg-red-700 p-2 rounded inline-block">
                                購入！
                            </a>
                        </div>
                    )) : (
                        <p className="text-center">ザクの残骸しか見つからなかった…</p>
                    )}
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="bg-gray-600 hover:bg-gray-700 p-2 rounded disabled:opacity-50"
                        tabIndex={0}
                    >
                        前へ
                    </button>
                    <button
                        onClick={() => setPage(page + 1)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded"
                        tabIndex={0}
                    >
                        コロニー移動！
                    </button>
                </div>
            </div>
        </>
    );
}